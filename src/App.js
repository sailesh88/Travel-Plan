import React, { useState } from "react";
import "./App.css";
import "antd/dist/antd.css";

import Home from "./pages/home";
import { Button, Layout, Select, Form, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import API from "./service/api";
import { link } from "./service/link";
const { Header, Sider, Content } = Layout;
const { Option } = Select;

const App = () => {
  const [form] = Form.useForm();
  const [selectedCities, setSelectedCities] = useState([]);
  const [cityLists, setCityLists] = useState([]);
  const [city, setCity] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isAddingCityAllowed, setIsAddingCityAllowed] = useState(true);
  const maxAllowedCities = 4;

  const cityOptions = cityLists.map((d, i) => (
    <Option
      className="select-option-text"
      key={d.id + i + selectedCities.length}
      value={JSON.stringify(d)}
    >
      <div className="select-option-container">
        <div className="country-text">
          <h3>{d.name}</h3>
          <h5>{`-(${d.country.code})`}</h5>
        </div>
        <h5>{d.regionType}</h5>
      </div>
    </Option>
  ));

  const handleChange = (value) => {
    let data = JSON.parse(value);
    setCity(() => [
      ...[],
      {
        id: data.id,
        name: data.name,
        location: data.location,
      },
    ]);
  };

  const inputHandler = (e) => {
    var searchUrl = `${link.getLocation}?term=${e}&index=cities`;

    API.get(searchUrl, {
      headers: {
        Authorization: "Bearer progtest",
      },
    })
      .then((res) => {
        let data = res.data.locations;
        setCityLists(...[], data);
      })
      .catch((error) => {
        console.error("There is an Error : ", error);
        message.error(error.response.data.message);
      });
  };

  const addCity = () => {
    setSelectedCities((prevState) => [...prevState, city[0]]);
    form.resetFields();
    if (selectedCities.length + 1 < maxAllowedCities) {
      setIsAddingCityAllowed(true);
    } else {
      setIsAddingCityAllowed(false);
    }
    setCity([]);
  };

  const completeTrip = () => {
    if (selectedCities.length > 0) {
      let lists = [];
      selectedCities.forEach((element) => {
        lists.push({
          lat: parseFloat(element.location.lat),
          lng: parseFloat(element.location.lon),
        });
      });
      console.log(lists);
      setLocations(...[], lists);
    }
  };

  const removeCity = (val) => {
    setSelectedCities(selectedCities.filter((item) => item.id !== val.id));
    if (selectedCities.length <= maxAllowedCities) {
      setIsAddingCityAllowed(true);
    } else {
      setIsAddingCityAllowed(false);
    }
  };

  return (
    <Layout>
      <Header
        className="App-header"
        style={{
          color: "white",
          textColor: "white",
        }}
      >
        <h1>Travel App</h1>
      </Header>
      <Layout className="App-content">
        <Sider width={"350px"} className="sider" theme="light">
          {selectedCities.map((element, i) => {
            console.log(element);
            return (
              <div className="selected-container">
                <Select
                  showSearch
                  disabled
                  key={i + element.id}
                  value={element.name}
                  style={{ width: "88%" }}
                  onChange={handleChange}
                  onSearch={inputHandler}
                  placeholder="Type in for search city"
                />

                <Button
                  type="primary"
                  style={{ width: "10%" }}
                  icon={<DeleteOutlined />}
                  onClick={() => removeCity(element)}
                  size={"default"}
                />
              </div>
            );
          })}

          {isAddingCityAllowed && (
            <div className="select-container">
              <Form
                form={form}
                name="advanced_search"
                className="ant-advanced-search-form"
              >
                <Form.Item name="region" label="Select city">
                  <Select
                    showSearch
                    name="Select-city"
                    style={{ width: "100%" }}
                    onChange={handleChange}
                    onSearch={inputHandler}
                    placeholder="Type in for search city"
                  >
                    {cityOptions}
                  </Select>
                </Form.Item>
              </Form>
            </div>
          )}

          <div className="button-container">
            {isAddingCityAllowed && (
              <Button type="primary" onClick={addCity}>
                Add another city
              </Button>
            )}
            <Button type="primary" onClick={completeTrip}>
              Complete trip
            </Button>
          </div>
        </Sider>
        <Content>
          {locations.length > 0 ? <Home data={locations} /> : <Home />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
