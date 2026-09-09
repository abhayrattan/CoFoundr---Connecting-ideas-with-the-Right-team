exports.getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CoFoundr API is up and running!',
    timestamp: new Date().toISOString()
  });
};
