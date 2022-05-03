import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Head from "next/head";

const Car = ({ car }) => {
  const routes = useRouter();
  const { id: carName } = routes.query;
  return (
    <React.Fragment>
      <Head>
        <title>{carName}</title>
      </Head>
      <h1>{car.name}</h1>
      <h2>{car.title}</h2>
      <h3>{car.make}</h3>
    </React.Fragment>
  );
};

Car.propTypes = {
  car: PropTypes.object,
};

// export const getServerSideProps = async (input) => {
//   const { id } = input.params;
//   const req = await fetch(`http://localhost:3000/${id}.json`);
//   const data = await req.json();

//   return {
//     props: { car: data },
//   };
// };

export const getStaticProps = async (input) => {
  const { id } = input.params;
  const req = await fetch(`http://localhost:3000/${id}.json`);
  const data = await req.json();

  return {
    props: { car: data },
  };
};

export const getStaticPaths = async (input) => {
  const req = await fetch("http://localhost:3000/cars.json");
  const data = await req.json();
  return {
    paths: data.map((id) => ({
      params: { id },
    })),
    fallback: false,
  };
};

export default Car;
