import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout() {

  return (

    <div style={styles.container}>

      {/* Sidebar */}
      <Sidebar />


      {/* Right Section */}
      <div style={styles.main}>


        {/* Navbar */}
        <Navbar />


        {/* Page Content */}
        <div style={styles.content}>

          <Outlet />

        </div>


        {/* Footer */}

        <footer style={styles.footer}>

          © {new Date().getFullYear()} DPMS | Document Processing Management System

        </footer>


      </div>


    </div>

  );

}



const styles = {


container:{

    display:"flex",

    minHeight:"100vh",

    background:"var(--bg-primary)",

    color:"var(--text-primary)",

    transition:"0.3s",

},



main:{


    marginLeft:"260px",


    width:"calc(100% - 260px)",


    display:"flex",


    flexDirection:"column",


    minHeight:"100vh",


},




content:{


    flex:1,


    padding:"30px",


    background:"var(--bg-primary)",


    color:"var(--text-primary)",


    transition:"0.3s",


},




footer:{


    height:"60px",


    background:"var(--card-bg)",


    borderTop:"1px solid var(--border-color)",


    display:"flex",


    alignItems:"center",


    justifyContent:"center",


    color:"var(--text-secondary)",


    fontSize:"14px",


    fontWeight:"500",


    transition:"0.3s",


},



};



export default DashboardLayout;