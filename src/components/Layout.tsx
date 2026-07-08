import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title }: Props) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="content">
          {title && (
            <div className="page-header">
              <h1>{title}</h1>
              <p>Manage your gym operations from one place.</p>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}