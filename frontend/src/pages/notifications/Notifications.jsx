import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Bell,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  Trash2,
  CheckCheck,
  Info,
} from "lucide-react";
import "./Notifications.css";

function Notifications() {

  const userId = localStorage.getItem("userId");

  /* ======================================
      Dummy Data
      Later this will come from Spring Boot
  ====================================== */

  const [notifications, setNotifications] = useState([]);

  const [dbNotifications, setDbNotifications] = useState([]);

  /* ======================================
      Search & Filter
  ====================================== */

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  /* ======================================
      Filtered Notifications
  ====================================== */

  const allNotifications = [...dbNotifications];

  const filteredNotifications = useMemo(() => {

    return allNotifications.filter((item) => {

      const matchesSearch =
        item.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.message
          .toLowerCase()
          .includes(search.toLowerCase());

      if (filter === "All")
        return matchesSearch;

      if (filter === "Unread")
        return matchesSearch && !item.read;

      if (filter === "Approved")
        return (
          matchesSearch &&
          item.type === "approved"
        );

      if (filter === "Rejected")
        return (
          matchesSearch &&
          item.type === "rejected"
        );

      if (filter === "Pending")
        return (
          matchesSearch &&
          item.type === "pending"
        );

      return matchesSearch;

    });

  }, [allNotifications, search, filter]);

  useEffect(() => {

    fetchNotifications();

  }, [userId]);





  const fetchNotifications = async () => {

    try {

      const response = await axios.get(
        `http://localhost:8080/api/notifications/user/${userId}`
      );


      const formatted =
        response.data.map(item => ({

          id: item.id,

          title: item.title,

          message: item.message,

          type: "info",

          time: new Date(item.createdAt)
            .toLocaleString(),

          read: item.isRead

        }));


      setDbNotifications(formatted);


    }
    catch (error) {

      console.log(
        "Notification fetch error",
        error
      );

    }

  };


  /* ======================================
      Notification Actions
  ====================================== */

  const markAsRead = async (id) => {

    try {

      await axios.put(
        `http://localhost:8080/api/notifications/read/${id}`
      );


      setDbNotifications((prev) =>
        prev.map(item =>
          item.id === id
            ?
            {
              ...item,
              read: true
            }
            :
            item
        )
      );


      setNotifications((prev) =>
        prev.map(item =>
          item.id === id
            ?
            {
              ...item,
              read: true
            }
            :
            item
        )
      );


    }
    catch (error) {

      console.log(error);

    }

  };

  const markAllAsRead = () => {

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );

  };

  const deleteNotification = async (id) => {

    try {

      await axios.delete(
        `http://localhost:8080/api/notifications/${id}`
      );


      setDbNotifications((prev) =>
        prev.filter(item => item.id !== id)
      );


      setNotifications((prev) =>
        prev.filter(item => item.id !== id)
      );
    }
    catch (error) {

      console.log(error);

    }
  };

  /* ======================================
      Notification Icon
  ====================================== */

  const getIcon = (type) => {

    switch (type) {

      case "approved":
      case "success":
        return (
          <CheckCircle2
            size={28}
            color="#16A34A"
          />
        );

      case "rejected":
        return (
          <XCircle
            size={28}
            color="#DC2626"
          />
        );

      case "pending":
        return (
          <Clock3
            size={28}
            color="#F59E0B"
          />
        );

      default:
        return (
          <Info
            size={28}
            color="#2563EB"
          />
        );

    }

  };
  return (

    <div className="notifications-page">

      {/* Header */}

      <div className="notifications-header">

        <div>

          <h1>Notifications</h1>

          <p>
            Stay updated with your applications and account activity.
          </p>

        </div>

        <button
          className="mark-all-btn"
          onClick={markAllAsRead}
        >
          <CheckCheck size={18} />

          Mark All as Read

        </button>

      </div>

      {/* Search */}

      <div className="search-section">

        <Search size={20} className="search-icon" />

        <input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* Filters */}

      <div className="filter-buttons">

        {[
          "All",
          "Unread",
          "Approved",
          "Rejected",
          "Pending",
        ].map((item) => (

          <button

            key={item}

            onClick={() => setFilter(item)}

            className={
              filter === item
                ? "active-filter"
                : ""
            }

          >

            {item}

          </button>

        ))}

      </div>

      {/* Notifications */}

      <div className="notification-list">

        {filteredNotifications.length === 0 ? (

          <div className="empty-state">

            <Bell size={60} />

            <h2>No Notifications Found</h2>

            <p>
              There are no notifications matching your search.
            </p>

          </div>

        ) : (

          filteredNotifications.map((item) => (

            <div

              key={item.id}

              className={`notification-card ${item.read
                  ? "read"
                  : "unread"
                }`}

            >

              <div className="notification-icon">

                {getIcon(item.type)}

              </div>

              <div className="notification-content">

                <div className="notification-top">

                  <h3>

                    {item.title}

                  </h3>

                  {!item.read && (

                    <span className="badge">

                      Unread

                    </span>

                  )}

                </div>

                <p>

                  {item.message}

                </p>

                <small>

                  {item.time}

                </small>

              </div>

              <div className="notification-actions">

                {!item.read && (

                  <button

                    className="read-btn"

                    onClick={() =>
                      markAsRead(item.id)
                    }

                  >

                    <CheckCircle2 size={18} />

                    Read

                  </button>

                )}

                <button

                  className="delete-btn"

                  onClick={() =>
                    deleteNotification(item.id)
                  }

                >

                  <Trash2 size={18} />

                  Delete

                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default Notifications;