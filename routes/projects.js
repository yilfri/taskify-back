const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Create Projects
// api/projects
router.post(
	'/',
	auth,
	[check('name', 'Project name is required').not().isEmpty()],
	projectController.createProject
);

//Get projects
router.get('/', auth, projectController.getProjects);

//Update projects for ID
router.put(
	'/:id',
	auth,
	[check('name', 'Project name is required').not().isEmpty()],
	projectController.updateProject
);

//Update projects for ID
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;
