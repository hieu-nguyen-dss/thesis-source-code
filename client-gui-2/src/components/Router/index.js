import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../../scenes/Login";
import AuthProvider from "../../contexts/AuthProvider";
import AppProvider from "../../contexts/AppProvider";
const AddRoomModal = React.lazy(() => import("../Modals/AddRoomModal"));
const InviteMemberModal = React.lazy(() =>
  import("../Modals/InviteMemberModal")
);

const Home = React.lazy(() => import("../../scenes/Home"));
const CourseDetail = React.lazy(() =>
  import("../../scenes/Courses/components/CourseDetail")
);
const Courses = React.lazy(() => import("../../scenes/Courses"));
const MyCourses = React.lazy(() => import("../../scenes/MyCourses"));
const NoteSharing = React.lazy(() => import("../ChatRoom/NoteSharing"));
const Router = () => {
  return (
    <Routes>
      <Route
        path="/"
        exact
        element={
          <React.Suspense fallback={<>...</>}>
            <Home />
          </React.Suspense>
        }
      />
      <Route
        path="/courses"
        exact
        element={
          <React.Suspense fallback={<>...</>}>
            <Courses />
          </React.Suspense>
        }
      />
      <Route
        path="/note-sharing"
        element={
          <React.Suspense fallback={<>...</>}>
            <NoteSharing />
          </React.Suspense>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <React.Suspense fallback={<>...</>}>
            <AuthProvider>
              <AppProvider>
                <CourseDetail />
                <AddRoomModal />
                <InviteMemberModal />
              </AppProvider>
            </AuthProvider>
          </React.Suspense>
        }
      />
      <Route
        path="/my-courses"
        element={
          <React.Suspense fallback={<>...</>}>
            <MyCourses />
          </React.Suspense>
        }
      />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
export default Router;
