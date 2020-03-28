import React, { useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import moment from "moment";

const Search = () => {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);

  const handleChange = value => {
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

  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} style={{ flex: 1, margin: "0 2rem 0 2rem" }}>
      <Autocomplete
        options={options}
        getOptionLabel={option => option.title}
        onChange={(event, value) => setSearch(value)}
        renderInput={params => (
          <TextField
            {...params}
            onChange={e => handleChange(e.target.value)}
            placeholder="Search..."
          />
        )}
        renderOption={option =>
          option.topic ? (
            <Link to={`/t/${option.topic}/p/${option._id}`}>
              {option.title} | Posted by {option.author} | t/{option.topic} |{" "}
              {moment(option.date).fromNow()}
            </Link>
          ) : (
            <Link to={`/t/${option.title}`}>t/{option.title}</Link>
          )
        }
      />
    </form>
  );
};

export default Search;
