const SubscriptionModal = (data) => {
  return (
    <Modal
      keepMounted
      open={openMoal}
      onClose={handleClose}
      aria-labelledby='keep-mounted-modal-title'
      aria-describedby='keep-mounted-modal-description'
    >
      <Box sx={style}>
        <Typography id='keep-mounted-modal-title' variant='h6' component='h2'>
          Text in a modal
        </Typography>
        <Typography id='keep-mounted-modal-description' sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </Box>
    </Modal>
  );
};

export default SubscriptionModal;
