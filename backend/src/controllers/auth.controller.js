const db = require('../data/db');

/**
 * @desc   Sync or update customer profile after Firebase signup/login
 * @route  POST /api/auth/sync-profile
 */
const syncProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const uid = req.user.uid;
    const email = req.user.email;

    const updatedUser = await db.syncFirebaseUser({
      firebase_uid: uid,
      email,
      name: name ? name.trim() : req.user.name,
      phone: phone ? phone.trim() : (req.user.phone || '')
    });

    res.status(200).json({
      success: true,
      message: 'Profile synchronized successfully',
      data: {
        user: {
          id: updatedUser.id,
          uid: updatedUser.firebase_uid,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone || '',
          role: updatedUser.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to sync profile: ' + error.message
    });
  }
};

/**
 * @desc   Get Current Logged-in User Profile (Protected by Firebase Auth)
 * @route  GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = await db.findUserByFirebaseUid(req.user.uid) || await db.findUserByEmail(req.user.email);
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user ? user.id : req.user.id,
          uid: req.user.uid,
          name: user ? user.name : req.user.name,
          email: user ? user.email : req.user.email,
          phone: user ? (user.phone || '') : '',
          role: user ? user.role : req.user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile: ' + error.message
    });
  }
};

/**
 * @desc   Legacy / Direct Auth verification endpoint
 * @route  POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    // If request passed requireAuth or contains user in req
    if (req.user) {
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: req.user
        }
      });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await db.findUserByEmail(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login verified',
      data: {
        user: {
          id: user.id,
          uid: user.firebase_uid,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication failed: ' + error.message
    });
  }
};

module.exports = {
  syncProfile,
  getMe,
  login
};
