const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// Create new task
exports.createTask = async (req, res) => {
	// Check if have errors.
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		// Extract project and verify if exist
		const { project } = req.body;

		const projectExist = await Project.findById(project);
		if (!projectExist) {
			return res.status(404).json({ msg: 'Project not found' });
		}

		// Check if the current project belongs to the current user
		if (projectExist.author.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}

		// Create task.
		const task = new Task(req.body);
		await task.save();
		res.json({ task });
	} catch (error) {
		console.log(error);
		res.status(500).send('Have a error');
	}
};

// Get Task.
exports.getTask = async (req, res) => {
	try {
		// Extract project and verify if exist
		const { project } = req.query;

		const projectExist = await Project.findById(project);
		if (!projectExist) {
			return res.status(404).json({ msg: 'Project not found' });
		}

		// Check if the current project belongs to the current user
		if (projectExist.author.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}

		// Get tasks for project.
		const tasks = await Task.find({ project }).sort({ creation_date: -1 });
		res.json({ tasks });
	} catch (error) {
		console.log(error);
		res.status(500).send('Have a error');
	}
};

// Update Task.
exports.updateTask = async (req, res) => {
	try {
		// Extract project and verify if exist
		const { project, name, status } = req.body;

		// If task exist.
		let task = await Task.findById(req.params.id);

		if (!task) {
			return res.status(404).json({ msg: 'Task not found' });
		}

		// Extact project
		const projectExist = await Project.findById(project);

		// Check if the current project belongs to the current user
		if (projectExist.author.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}

		// Create object with new info.
		const newTask = {};

		newTask.name = name;
		newTask.status = status;

		// Save Task
		task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, { new: true });

		res.json({ task });
	} catch (error) {
		console.log(error);
		res.status(500).send('Have a error');
	}
};

// Delete Task.
exports.deleteTask = async (req, res) => {
	try {
		// Extract project and verify if exist
		const { project } = req.query;

		// If task exist.
		let task = await Task.findById(req.params.id);

		if (!task) {
			return res.status(404).json({ msg: 'Task not found' });
		}

		// Extact project
		const projectExist = await Project.findById(project);

		// Check if the current project belongs to the current user
		if (projectExist.author.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}

		// Delete task.
		await Task.findByIdAndRemove({ _id: req.params.id });
		res.json({ msg: 'Task deleted' });
	} catch (error) {
		console.log(error);
		res.status(500).send('Have a error');
	}
};
