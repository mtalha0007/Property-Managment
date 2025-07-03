import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton } from '@mui/material';

function SimpleDialog({ open, onClose, title, children,selectedUser,border  }) {
  return (
    <Dialog
    onClose={()=>onClose()}
      maxWidth="sm"
      open={open}
      sx={{ '& .MuiDialog-paper': { border:border, width: '80%', height: "auto", borderRadius: 4, py: { xs: 2, md: 4 }, px: { xs: 3, md: 6 } } }}
    >
      <IconButton color="primary" onClick={() => onClose()} sx={{ position: 'absolute', right: 13, top: 13 }}>
        <Close />
      </IconButton>
      <DialogTitle sx={{ textAlign: "center", fontSize: '22px', fontWeight: 700 ,textTransform:"capitalize"}}>{title}</DialogTitle>
      {children}

    </Dialog>
  )
}

export default SimpleDialog