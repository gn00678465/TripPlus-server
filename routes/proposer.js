const express = require('express');
const router = express.Router();
const ProposerController = require('../controllers/proposer');

router.get('/:teamId', ProposerController.getProposer);

module.exports = router;
