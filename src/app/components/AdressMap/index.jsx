import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Add, Close, Favorite, Home, Work } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import usePlacesAutocomplete from "use-places-autocomplete";
import { setKey, setRegion, fromAddress, fromLatLng } from "react-geocode";
import Colors from "../../../app/assets/styles/index";

const googleMapKey = `AIzaSyCsT-b8-J4wnqKYUBFROMPQr_IEYdjNiSg`;

  const PlacesAutocomplete = ({ address, geoAddress, setAddress, setCoords }) => {
    const {
      ready,
      setValue,
      suggestions: { status, data },
    } = usePlacesAutocomplete({
      requestOptions: {
        region: "us",
        componentRestrictions: { country: "us" },
      },
      debounce: 300,
    });

    return (
      <Fragment>
        <Autocomplete
          sx={{ my: 2 }}
          size="small"
          fullWidth
          id="combo-box-demo"
          disabled={!ready}
          onInputChange={(event, newInputValue) => {
            setValue(newInputValue);
          }}
          onChange={(event, newValue) => {
            geoAddress(newValue, setCoords);
            setAddress(newValue);
          }}
          defaultValue={address}
          value={address}
          options={data.map((option) => option.description)}
          renderInput={(params) => (
            <TextField {...params} label="Enter Your Pin Location" />
          )}
        />
      </Fragment>
    );
  };

function Map({ newAddress, defaultData }) {
  setKey(googleMapKey);
  setRegion("us");

  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });

  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  console.log("Map address=====>", address);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapKey,
    libraries: ["places"],
  });

  const containerStyle = {
    width: "100%",
    height: "200px",
    borderRadius: "10px",
    boxShadow: `rgba(149, 157, 165, 0.2) 0px 8px 24px`,
  };

  const options = {
    disableDefaultUI: true,
    zoomControl: false,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
    ],
  };

  const handleMapLoad = (map) => {
    map.addListener("click", (e) => {
      fromLatLng(e.latLng.lat(), e.latLng.lng()).then(
        (response) => {
          setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          setAddress(response.results[0].formatted_address);
          setCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        },
        (error) => {
          console.error(error);
        }
      );
    });
  };

  const handleMarkerLoad = (marker) => {
    marker.addListener("dragend", (e) => {
      fromLatLng(e.latLng.lat(), e.latLng.lng()).then(
        (response) => {
          setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          setAddress(response.results[0].formatted_address);
          setCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        },
        (error) => {
          console.error(error);
        }
      );
    });
  };

  const geoAddress = (address, setCoords) => {
    if (address === null) {
      return;
    } else {
      fromAddress(address).then((response) => {
        const lat = response.results[0]?.geometry?.location?.lat;
        const lng = response.results[0]?.geometry?.location?.lng;
        setCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
        setCoords({ lat, lng });
      });
    }
  };

  useEffect(() => {
    if (defaultData) {
      setCenter({ lat: defaultData?.latitude, lng: defaultData?.longitude });
      setMarkerPosition({
        lat: defaultData?.latitude,
        lng: defaultData?.longitude,
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat: latitude, lng: longitude });
        setMarkerPosition({ lat: latitude, lng: longitude });
        setCoords({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  useEffect(() => {
    if (address) {
      let obj = {
        address: address,
        latitude: coords?.lat,
        longitude: coords?.lng,
      };
      newAddress(obj);
    }
  }, [address, coords]);

  return (
    <Fragment>
      {isLoaded ? (
        <>
          <PlacesAutocomplete
            setAddress={setAddress}
            address={address}
            geoAddress={geoAddress}
            setCoords={setCoords}
          />

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            options={options}
            onLoad={handleMapLoad}
          >
            <MarkerF
              position={markerPosition}
              draggable={true}
              onDragEnd={(e) => {
                setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                setCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
              }}
              onLoad={handleMarkerLoad}
            />
          </GoogleMap>
        </>
      ) : (
        ""
      )}
    </Fragment>
  );
}

function AddressForm({
  open,
  onClose,
  defaultData,
  save,
  address: initialAddress,
}) {
  const {
    register,
    handleSubmit:handleSubmit2,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm();

  const [addressDetail, setAddressDetail] = useState();

  const submitForm = async (formData) => {
    const obj = {
      ...addressDetail,
    };
    console.log("formData===>", obj);
    save(obj);
    onClose();
    reset();
  };

  useEffect(() => {
    if (defaultData) {
      setValue("address", defaultData?.address);
      setValue("street", defaultData?.street);
      setValue("area", defaultData?.area);
      setValue("house", defaultData?.house_building);
      setValue("apt", defaultData?.apt_room);
      setValue("label", defaultData?.tag);
    }
  }, [defaultData, setValue]);

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          height: "auto",
          borderRadius: 2,
          py: { xs: 1.5, md: 3 },
          px: { xs: 1, md: 3 },
        },
      }}
    >
      <IconButton
        onClick={() => {
          onClose();
          reset();
        }}
        sx={{ position: "absolute", right: 13, top: 13, color: Colors.primary }}
      >
        <Close />
      </IconButton>
      <DialogTitle
        sx={{ textAlign: "center", fontSize: "18px", fontWeight: 700 }}
      >
        {"Select Address"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit2(submitForm)}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
              <Map
                newAddress={(data) => {
                  setAddressDetail(data);
                  setValue("address", data?.address);
                  setValue("lat", data?.latitude);
                  setValue("lng", data?.longitude);
                }}
                defaultData={defaultData}
              />
          </Grid>
        
          <Grid item xs={12} sm={12} sx={{ mt: 1 }}>
            <Box sx={{ display: "flex" }}>
              <Button
                sx={{
                  width: "50%",
                  backgroundColor: Colors.primary,
                  color: "white",
                  "&:hover": { backgroundColor: Colors.primary, color: "white" },
                }}
                // type={"submit"}
                onClick={submitForm}
              >
                Save
              </Button>
              <Box sx={{ mx: 0.5 }} />
              <Button
                sx={{
                  width: "50%",
                  backgroundColor: Colors.primary,
                  color: "white",
                  "&:hover": { backgroundColor: Colors.primary, color: "white" },
                }}
                onClick={() => {
                  onClose();
                  reset();
                }}
              >
                CANCEL
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}

export { AddressForm, Map };
