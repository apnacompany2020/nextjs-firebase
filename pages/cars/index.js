import React from "react";
import PropTypes from "prop-types";

const CarsList = ({ carList }) => {
  return (
    <React.Fragment>
      <h1>this is a cars list</h1>
      {carList.map((car) => (
        <h2 key={car}>{car}</h2>
      ))}
    </React.Fragment>
  );
};

CarsList.propTypes = {
  carList: PropTypes.array,
};

export const getStaticProps = async (input) => {
  const req = await fetch("http://localhost:3000/cars.json");
  const data = await req.json();

  return {
    props: { carList: data },
  };
};

export default CarsList;
