import { Box } from "@mui/material";
import Form from "../../../Components/form/Form";
import Header from "../../../Components/Header/Header";
import { featureInputFields } from "../../../Components/sources/formSources";
import { useDispatch, useSelector} from "react-redux"


export default function NewFeature() {
 
  return (
    <Box m="0px 20px 20px 20px">
      {/* Header for features page */}
      <Header title="FEATURES" subTitle="Managing Application Features" />
      {/* Add new Feature Form */}
      <Form inputs={featureInputFields} />
    </Box>
  );
}
