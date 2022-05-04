import React from "react";
import PropTypes from "prop-types";

const Loader = ({ show }) => {
  return show ? <div className="loader" /> : null;
};

Loader.propTypes = {
  show: PropTypes.bool,
};

export default Loader;
