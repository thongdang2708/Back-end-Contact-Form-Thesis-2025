const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	message: 'Too many requests, please try again later.',
	handler: (req, res) => {
		res.status(429).json({
		  success: false,
		  message: "Too many requests from this IP. Please try again after 15 minutes.",
		});
	  },
});

module.exports = limiter;