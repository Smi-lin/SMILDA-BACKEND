const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const express = require("express");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// CREATE NEW CONVERSATION

router.post(
  "/createNewConversation",
  catchAsyncError(async (req, res, next) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;

      // Check if a conversation with the same title exists
      const existingConversation = await Conversation.findOne({
        groupTitle: groupTitle,
      });

      if (existingConversation) {
        return res.status(200).json({
          success: false,
          message: "Conversation already exists with this title.",
          conversation: existingConversation,
        });
      }

      // Create a new conversation
      const newConversation = await Conversation.create({
        members: [userId, sellerId],
        groupTitle: groupTitle,
      });

      res.status(201).json({
        success: true,
        conversation: newConversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

// GET SELLER CONVERSATION
router.get(
  "/getAllConversationSeller/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.sellerId],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

// get user conversations
router.get(
  "/getAllConversationUser/:id",
  protect,
  catchAsyncError(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(201).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

// update the last message
router.put(
  "/updateLastMessage/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const { lastMessage, lastMessageId } = req.body;

      const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
        lastMessage,
        lastMessageId,
      });

      res.status(201).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

module.exports = router;
