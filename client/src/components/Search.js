import React, { useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import moment from "moment";

const Search = () => {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);

  const handleChange = (value) => {
    setSearch(value);
    const fetchSearch = async () => {
      const res = await fetch(
        `http://localhost:5000/api/index/search?value=${value}`
      );
      const data = await res.json();
      setOptions(data);
    };
    value.length > 3 && fetchSearch();
  };

  return (
    <Autocomplete
      style={{ flex: 1, margin: "0 1rem 0 2rem" }}
      options={options}
      getOptionLabel={(option) => option.title}
      renderInput={(params) => (
        <TextField
          {...params}
          value={search}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search..."
        />
      )}
      renderOption={(option) =>
        option.topic ? (
          <Link to={`/t/${option.topic}/p/${option._id}`} style={{ flex: 1 }}>
            {option.title} | Posted by {option.author} | t/{option.topic} |{" "}
            {moment(option.date).fromNow()}
          </Link>
        ) : (
          <Link to={`/t/${option.title}`}>t/{option.title}</Link>
        )
      }
    />
  );
};

export default Search;
