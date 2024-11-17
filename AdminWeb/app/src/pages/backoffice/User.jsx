import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";

import { Table, Input, Space, Button, Image } from "antd";
import { createStyles } from "antd-style";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

import BackOffice from "../../components/BackOffice";
import MyModal from "../../components/MyModal";
import config from "../../config";

const { TextArea } = Input;

axios.interceptors.response.use(
  (response) => response, // Return the response normally if successful
  (error) => {
    if (error.response && error.response.status === 401) {
      // Automatically redirect to sign in page if 401 Unauthorized is returned
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

function User() {
  const [clientList, setClientList] = useState([]);
  const [client, setClient] = useState({});
  const [selectedClients, setSelectedClients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) setTimeout(() => searchInput.current?.select(), 100);
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      fixed: "left",
      width: "50px",
      title: "ID",
      dataIndex: "id",
      key: "id",
      className: "text-center",
      sorter: (a, b) => a.id - b.id,
      ...getColumnSearchProps("id"),
    },
    {
      width: "100px",
      title: "Profile",
      dataIndex: "profile",
      key: "profile",
      className: "text-center",
      render: (profile) => (
        <Image
          height={100}
          width={"full"}
          className="rounded-circle"
          src={config.apiPath + "/uploads/user_img/" + profile}
          fallback="default_profile.jpg"
        />
      ),
    },
    {
      fixed: "left",
      width: "180px",
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      width: "300px",
      title: "Address",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
    },
    {
      width: "90px",
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
    },
  ];

  const fetchData = async () => {
    try {
      const clientListResult = await axios.get(
        config.apiPath + "/user/clientList/",
        config.headers()
      );
      if (clientListResult.data.results !== undefined) {
        setClientList(clientListResult.data.results);
      }
    } catch (e) {
      Swal.fire({
        title: "Error!",
        text: e.message,
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [isEdit, setIsEdit] = useState(false);
  const [errorForm, setErrorForm] = useState({});
  const clearErrorBorder = (e) => {
    setErrorForm((prev) => ({
      ...prev,
      [e]: "",
    }));
  };
  const handleEdit = () => {
    
  };

  const handleRemove = () => {

  };

  return (
    <BackOffice>
      <div className="mb-3 row">
        <div className="h5 col" style={{ fontWeight: "bold" }}>
          User Manager
        </div>
        <div id="buttonGroup" className="col text-right">
          <button
            id="editButton"
            className="btn btn-primary mr-2"
            style={{
              width: "40px",
              height: "40px",
              visibility: selectedClients.length === 1 ? "visible" : "hidden",
            }}
            data-toggle="modal"
            data-target="#modalClient"
            onClick={() => {
              setClient(() => {
                return clientList.find(
                  (client) => client.id === selectedClients[0]
                );
              });
            }}
          >
            <i className="ion-edit" style={{ fontSize: "18px" }}></i>
          </button>
          <button
            id="removeButton"
            className="btn btn-danger"
            style={{
              width: "40px",
              height: "40px",
              visibility: selectedClients.length > 0 ? "visible" : "hidden",
            }}
            onClick={handleRemove}
          >
            <i className="ion-android-delete" style={{ fontSize: "18px" }}></i>
          </button>
        </div>
      </div>

      <MyModal id="modalClient" title={`Edit Client ID: ${client.id}`}>
        <div className="row">
          <div className="col-4">
            <Image
              className="border rounded-circle hover-img"
              height={145}
              width={145}
              preview={false}
              src={config.apiPath + "/uploads/user_img/" + client.profile}
              fallback="default_profile.jpg"
            />
          </div>

          <div className="col-8">
            <div id="editName" className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <Input
                status={errorForm["name"] ? "error" : ""}
                allowClear
                type="text"
                value={client.name}
                onChange={(e) => setClient({ ...client, name: e.target.value })}
                onKeyDown={() => clearErrorBorder("name")}
              />
            </div>

            <div id="editAddress" className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <TextArea
                rows={5}
                allowClear
                value={client.desc}
                onChange={(e) => setClient({ ...client, desc: e.target.value })}
              />
            </div>

            <div id="editPhone" className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <Input
                status={errorForm["phone"] ? "error" : ""}
                allowClear
                type="text"
                value={client.phone}
                onChange={(e) =>
                  setClient({ ...client, phone: e.target.value })
                }
                onKeyDown={() => clearErrorBorder("phone")}
              />
            </div>
            <div className="text-right mt-3">
              <button className="btn btn-primary font-weight-bold" onClick={handleEdit}>
                <i className="fa fa-save mr-2"></i> Save
              </button>
            </div>
          </div>
        </div>
      </MyModal>

      <Table
        id="clientTable"
        size="small"
        sticky
        bordered={true}
        columns={columns}
        dataSource={clientList}
        scrollToFirstRowOnChange={true}
        rowKey={(record) => record.id}
        rowSelection={{
          onChange: (selectedRowKey) => {
            console.log(selectedRowKey);
            setSelectedClients(selectedRowKey);
          },
        }}
        scroll={{
          x: "max-content",
          y: 10 * 75,
        }}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
      />
    </BackOffice>
  );
}

export default User;
