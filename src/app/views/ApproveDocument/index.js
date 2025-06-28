import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context";
import Colors from "../../assets/styles";
import DocumentServices from "../../api/DocumentServices/index";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { jwtDecode } from "jwt-decode";
import SignaturePad from "react-signature-canvas";
import { ErrorToaster, SuccessToaster } from "../../components/Toaster";
import Loader from "../../components/Loader";

export default function ViewDocument() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState("");
  const [openSignDialog, setOpenSignDialog] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const theme = useTheme();

  const { user } = useAuth();
  const { id } = useParams();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const decodedToken = user ? jwtDecode(user.token) : {};
  const userIdFromToken = decodedToken.employee_id;
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const getDocuments = async () => {
    setLoading(true);
    try {
      const { data } = await DocumentServices.getDoc(userIdFromToken, id);
      setDocuments(data?.list || []);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDocuments();
  }, []);

  const sigPadRef = useRef({});

  const handleViewClick = (documentUrl) => {
    console.log(documentUrl);
    setSelectedDocumentUrl(documentUrl);
    setOpenModal(true);
  };

  const handleSignClick = (job) => {
    setOpenSignDialog(true);
  };

  const clearSignature = () => {
    sigPadRef.current.clear();
  };

  const submitSignature = async () => {
    const base64Signature = sigPadRef.current.toDataURL();
    const obj = {
      job_id: id,
      employee_id: userIdFromToken,
      type: documentName?.type,
      sign: base64Signature,
    };

    console.log("Signature Base64:", base64Signature);
    try {
      const { data, message } = await DocumentServices.SignDoc(obj);
      SuccessToaster(message);
      setOpenSignDialog(false);
      getDocuments();
    } catch (error) {
      ErrorHandler(error);
      ErrorToaster(error);
    } finally {
      setLoading(false);
      setOpenSignDialog(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDocumentUrl("");
  };

  const handleCloseSignDialog = () => {
    setOpenSignDialog(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "10px",
          alignItems: "center",
          mt: 9.5,
          pl: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "26px",
            color: Colors.primary,
            fontWeight: "600",
          }}
        >
          View Documents
        </Typography>
      </Box>

      {/* Document Table */}
      

          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              backgroundColor: Colors.backgroundColor,
              borderRadius: "10px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Sr. No.
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Document Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: "center" }}>
                      No documents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((document, index) => (
                    <TableRow key={document._id}>
                      <TableCell sx={{ textAlign: "center" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {document.document_name}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mx: 1 }}
                          onClick={() => {
                            handleViewClick(
                              document.signedDocument
                                ? document.signedDocument
                                : document.document_url
                            );
                            setDocumentName(document);
                          }}
                        >
                          View
                        </Button>
                        {document.signedDocument ? (
                          <Button
                            sx={{
                              background: Colors.seaGreen,
                              mx: 1,
                              color: Colors.white,
                              ":hover": { background: Colors.seaGreen },
                            }}
                          >
                            Signed
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ mx: 1 }}
                            onClick={() => {
                              setDocumentName(document);
                              handleSignClick();
                            }}
                          >
                            Sign
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
      
    

      {/* PDF View Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: { height: "98vh" },
        }}
      >
        <DialogContent
          sx={{
            height: "100%",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {selectedDocumentUrl ? (
            <iframe
              src={baseUrl + selectedDocumentUrl}
              width="100%"
              height="100%"
              title="PDF Preview"
              style={{ border: "none", overflow: "hidden" }}
            />
          ) : (
            <Typography>Unable to load document.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
