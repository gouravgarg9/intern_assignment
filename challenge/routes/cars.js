const express = require('express');
const multer = require('multer');
const path = require('path');
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const router = express.Router();
const AWS = require('aws-sdk');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multerS3 = require('multer-s3');

// Initialize the S3 client (AWS SDK V3)
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName); // Save file with a unique name
        },
    }),
    limits: { files: 10 }, // Limit to 10 images per upload
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - images
 *       properties:
 *         title:
 *           type: string
 *           example: "2019 Toyota Camry"
 *         description:
 *           type: string
 *           example: "A well-maintained car with low mileage"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["sedan", "toyota", "camry"]
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["/uploads/1596234932334-image.jpg"]
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Car not found"
 */

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Add a new car
 *     tags:
 *       - Cars
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "2019 Toyota Camry"
 *               description:
 *                 type: string
 *                 example: "A well-maintained car with low mileage"
 *               tags:
 *                 type: array
 *                 items:
 *                  type: string
 *                 example: ["sedan", "toyota", "camry"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Car created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       500:
 *         description: Error adding car
 */
router.post('/', auth, upload.array('images', 10), async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const userId = req.user.userId;

        // Map the uploaded files to their S3 URLs
        const imageUrls = req.files.map(file => file.location);
        let tags_parsed;
        try{tags_parsed=JSON.parse(tags)}
        catch{tags_parsed=[tags]}
        const car = new Car({
            userId,
            title,
            description,
            tags: tags_parsed,
            images: imageUrls,
        });

        await car.save();
        res.status(201).json(car);
    } catch (err) {
        console.error('Error adding car:', err);
        res.status(500).send('Error adding car');
    }
});

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Update a specific car
 *     tags:
 *       - Cars
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the car to update
 *         schema:
 *           type: string
 *           example: "60d5f1f5e3b4313b3c1df34a"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Title"
 *               description:
 *                 type: string
 *                 example: "Updated description of the car."
 *               tags:
 *                 type: array
 *                 items:
 *                  type: string
 *                 example: '["updated", "tags"]'
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               existingImages:
 *                 type: string
 *                 example: '["/uploads/1596234932334-image.jpg"]'
 *     responses:
 *       200:
 *         description: Car updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Car not found or you do not have permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to update car
 */
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const { title, description, tags, existingImages } = req.body;

    try {
        const car = await Car.findOne({ _id: id, userId });

        if (!car) {
            return res.status(404).send('Car not found or you do not have permission to update it.');
        }

        let tags_parsed;
        try{tags_parsed=JSON.parse(tags)}
        catch{tags_parsed=[tags]}

        // Update fields
        car.title = title;
        car.description = description;
        car.tags = tags_parsed;

        // Handle existing images
        const imagesToKeep = JSON.parse(existingImages || '[]');
        const imagesToRemove = car.images.filter(img => !imagesToKeep.includes(img));

        // Delete removed images from S3
        for (const imageUrl of imagesToRemove) {
            const key = imageUrl.split('/').pop();
            const deleteParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
            };
            await s3Client.send(new DeleteObjectCommand(deleteParams));
        }

        // Update the car's image list
        car.images = imagesToKeep;

        // Handle new images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.location);
            car.images.push(...newImages);
        }

        // Save the updated car
        const updatedCar = await car.save();
        res.status(200).send(updatedCar);
    } catch (err) {
        console.error('Error updating car:', err);
        res.status(500).send('Failed to update car.');
    }
});

/**
 * @swagger
 * /api/cars/{id}:
 *   delete:
 *     summary: Delete a specific car by ID
 *     tags:
 *       - Cars
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the car to delete
 *         schema:
 *           type: string
 *           example: "60d5f1f5e3b4313b3c1df34a"
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found
 *       500:
 *         description: Error deleting car
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const car = await Car.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!car) return res.status(404).send('Car not found');

        // Delete associated images from S3
        for (const imageUrl of car.images) {
            const key = imageUrl.split('/').pop();
            const deleteParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
            };
            await s3Client.send(new DeleteObjectCommand(deleteParams));
        }

        res.send('Car and associated images deleted successfully');
    } catch (err) {
        console.error('Error deleting car:', err);
        res.status(500).send('Error deleting car');
    }
});

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all cars for the authenticated user
 *     tags:
 *       - Cars
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 */
router.get('/', auth, async (req, res) => {
    const cars = await Car.find({ userId: req.user.userId });
    res.send(cars);
});

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Get a specific car by ID
 *     tags:
 *       - Cars
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the car to retrieve
 *         schema:
 *           type: string
 *           example: "60d5f1f5e3b4313b3c1df34a"
 *     responses:
 *       200:
 *         description: Car details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', auth, async (req, res) => {
    const car = await Car.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!car) return res.status(404).send("Car not found");
    res.send(car);
});

module.exports = router;
