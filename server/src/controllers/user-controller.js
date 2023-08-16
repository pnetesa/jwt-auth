const userService = require('../service/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../utils/api-error');

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest('Validation error', errors.array()))
      }

      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        // secure: true, // for HTTPS
        httpOnly: true, // Disable getting or changing cookie in browser
        maxAge: UserController.getRefreshTokenMaxAge(),
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  static getRefreshTokenMaxAge() {
    const days =  parseInt(
      process.env.REFRESH_TOKEN_MAX_AGE.substring(0, process.env.REFRESH_TOKEN_MAX_AGE.length - 1)
    );
    return days * 24 * 60 * 60 * 1000;
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        // secure: true, // for HTTPS
        httpOnly: true, // Disable getting or changing cookie in browser
        maxAge: UserController.getRefreshTokenMaxAge(),
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json({ message: 'Logged out' });
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        // secure: true, // for HTTPS
        httpOnly: true, // Disable getting or changing cookie in browser
        maxAge: UserController.getRefreshTokenMaxAge(),
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
