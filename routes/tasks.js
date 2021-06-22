const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Create task.
// api/tasks
router.post(
	'/',
	auth,
	[
		check('name', 'Taks name is required').not().isEmpty(),
		check('project', 'Project is required').not().isEmpty()
	],
	taskController.createTask
);

// Get task.
router.get('/', auth, taskController.getTask);

// Update task.
router.put('/:id', auth, taskController.updateTask);

// Delete task.
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;
