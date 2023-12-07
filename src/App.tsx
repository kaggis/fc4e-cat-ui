import { Container } from "react-bootstrap";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider, ProtectedRoute, KeycloakLogout } from "@/auth";
import { Header, Footer } from "@/components";
import {
  Home,
  Profile,
  RequestValidation,
  Validations,
  Users,
  ProfileUpdate,
  ValidationDetails,
} from "@/pages";

import "@/App.css";
import Assessments from "@/pages/assessments/Assessments";
import AssessmentsList from "@/pages/assessments/AssessmentsList";
import AssessmentEdit from "./pages/assessments/AssessmentEdit";

import { Toaster } from "react-hot-toast";
import Subjects from "./pages/Subjects";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: " ",
          duration: 2000,
          position: "top-right",
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
      />
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename="/">
            <Header />
            <main className="cat-main-view">
              <Container>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/assessments/create/:valID"
                    element={<ProtectedRoute />}
                  >
                    <Route index element={<AssessmentEdit />} />
                  </Route>
                  <Route
                    path="/assessments/create/"
                    element={<ProtectedRoute />}
                  >
                    <Route index element={<AssessmentEdit />} />
                  </Route>
                  <Route
                    path="/assessments/:asmtID"
                    element={<ProtectedRoute />}
                  >
                    {/* Use AssessmentEdit component with create mode = false to configure the view for update */}
                    <Route
                      index
                      element={<AssessmentEdit createMode={false} />}
                    />
                  </Route>
                  <Route path="/assess" element={<Assessments />} />
                  <Route path="/assessments" element={<ProtectedRoute />}>
                    <Route index element={<AssessmentsList />} />
                  </Route>
                  <Route
                    path="/public-assessments"
                    element={<AssessmentsList listPublic={true} />}
                  />
                  <Route path="/profile" element={<ProtectedRoute />}>
                    <Route index element={<Profile />} />
                  </Route>
                  <Route path="/profile/update" element={<ProtectedRoute />}>
                    <Route index element={<ProfileUpdate />} />
                  </Route>
                  <Route path="/admin/users" element={<ProtectedRoute />}>
                    <Route index element={<Users />} />
                  </Route>
                  <Route
                    path="/validations/request"
                    element={<ProtectedRoute />}
                  >
                    <Route index element={<RequestValidation />} />
                  </Route>
                  <Route path="/objects" element={<ProtectedRoute />}>
                    <Route index element={<Subjects />} />
                  </Route>
                  <Route path="/validations" element={<ProtectedRoute />}>
                    <Route index element={<Validations />} />
                  </Route>
                  <Route path="/validations/:id" element={<ProtectedRoute />}>
                    <Route index element={<ValidationDetails />} />
                  </Route>
                  <Route path="/admin/validations" element={<ProtectedRoute />}>
                    <Route index element={<Validations admin={true} />} />
                  </Route>
                  <Route
                    path="/admin/validations/:id"
                    element={<ProtectedRoute />}
                  >
                    <Route index element={<ValidationDetails admin={true} />} />
                  </Route>
                  <Route
                    path="/admin/validations/:id/reject"
                    element={<ProtectedRoute />}
                  >
                    <Route
                      index
                      element={<ValidationDetails toReject={true} />}
                    />
                  </Route>
                  <Route
                    path="/admin/validations/:id/approve"
                    element={<ProtectedRoute />}
                  >
                    <Route
                      index
                      element={<ValidationDetails toApprove={true} />}
                    />
                  </Route>
                  <Route path="/login" element={<ProtectedRoute />}>
                    <Route index element={<Profile />} />
                  </Route>
                  <Route path="/logout" element={<KeycloakLogout />} />
                </Routes>
              </Container>
            </main>
            <Footer />
          </BrowserRouter>
        </QueryClientProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
