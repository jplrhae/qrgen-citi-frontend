import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import { Fade } from "@mui/material";

export const FileUploadAlert = (props: {
  onClose: () => void;
  status: string;
}) => {
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    if (!open) {
      props.onClose();
    }
  }, [open]);

  return (
    <Box sx={{ marginTop: "14px" }}>
      <Fade in={open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          severity={
            props.status === "success"
              ? "success"
              : props.status === "server-error"
              ? "error"
              : "warning"
          }
        >
          {props.status === "success"
            ? "Arquivo de remessa enviado com sucesso!"
            : props.status === "server-error"
            ? "Houve um erro ao processar o arquivo. Tente novamente."
            : "O arquivo enviado não é um arquivo de remessa válido."}
        </Alert>
      </Fade>
    </Box>
  );
};
