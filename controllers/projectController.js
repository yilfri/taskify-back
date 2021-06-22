const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.createProject = async (req, res) => {
	// Check if have errors.
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		// Create new project.
		const project = new Project(req.body);

		// Save author with JWT
		project.author = req.user.id;

		//Save project.
		project.save();
		res.json(project);
	} catch (error) {
		console.log(error);
		res.status(500).send('Hubo un error');
	}
};

// Get all projects to actual user.
exports.getProjects = async (req, res) => {
	try {
		const projects = await Project.find({ author: req.user.id }).sort({ creation_date: -1 });
		res.json({ projects });
	} catch (error) {
		console.log(error);
		res.status(500).send('There was an error');
	}
};

// Update project.
exports.updateProject = async (req, res) => {
	// Check if have errors.
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Extract project information.
	const { name } = req.body;
	const newProject = {};

	if (name) {
		newProject.name = name;
	}

	try {
		// Check ID.
		let project = await Project.findById(req.params.id);

		// Project exist or not.
		if (!project) {
			return res.status(404).json({ msg: 'Project not found' });
		}
		// Check project author.
		if (project.author.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}
		// Update.
		project = await Project.findByIdAndUpdate(
			{ _id: req.params.id },
			{ $set: newProject },
			{ new: true }
		);

		res.json({ project });
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
};

// Delete Project by ID.

exports.deleteProject = async (req, res) => {
	try {
		// Check ID.
		let project = await Project.findById(req.params.id);

		// Project exist or not.
		if (!project) {
			return res.status(404).json({ msg: 'Project not found' });
		}
		// Check project author.
		if (project.author.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}

		// Delete Project
		await Project.findByIdAndRemove({ _id: req.params.id });
		res.json({ msg: 'Project Deleted' });
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
};
