const db = require('../data/db');

/**
 * @desc   Get all customer reviews
 * @route  GET /api/reviews
 */
const getReviews = async (req, res) => {
  try {
    const reviews = await db.getReviews();
    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: Number(averageRating),
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve reviews: ' + error.message
    });
  }
};

/**
 * @desc   Submit a customer review (authenticated)
 * @route  POST /api/reviews
 */
const createReview = async (req, res) => {
  try {
    const { rating, comment, name } = req.body;

    const reviewerName = req.user ? (req.user.name || name) : name;

    const errors = [];
    if (!reviewerName || typeof reviewerName !== 'string' || !reviewerName.trim()) {
      errors.push('name is required');
    }
    const numRating = Number(rating);
    if (rating === undefined || isNaN(numRating) || numRating < 1 || numRating > 5 || !Number.isInteger(numRating)) {
      errors.push('rating must be an integer between 1 and 5');
    }
    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      errors.push('comment is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    const newReview = await db.createReview({
      userId: req.user ? req.user.id : null,
      name: reviewerName.trim(),
      rating: numRating,
      comment: comment.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: newReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit review: ' + error.message
    });
  }
};

/**
 * @desc   Delete a review (admin)
 * @route  DELETE /api/reviews/:id
 */
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteReview(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Review '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: deleted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete review: ' + error.message
    });
  }
};

module.exports = {
  getReviews,
  createReview,
  deleteReview
};
