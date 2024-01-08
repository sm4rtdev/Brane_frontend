import React, { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { UserDataContext } from "../contexts/UserDataContext";

import ScrollToTop from "../helpers/ScrollToTop";
import SpinnerOfDoom from "../components/SpinnerOfDoom/SpinnerOfDoom";
import AccountRecoveryBox from "../pages/Public/AuthPage/AccountRecoveryBox/AccountRecoveryBox";
import AddUsers from "../pages/Private/Business/AddUsers/AddUsers";
import AdvancedSearchPage from "../pages/Private/Shared/AdvancedSearchPage/AdvancedSearchPage";
import Article from "../pages/Public/Blog/Article";
import AuthPage from "../pages/Public/AuthPage/AuthPage";
import BusinessPage from "../pages/Public/BusinessPage/BusinessPage";
import CartPage from "../pages/Private/Shared/CartPage/CartPage";
import ChatPage from "../pages/Private/Shared/Chat/ChatPage";
import CoursePage from "../pages/Private/Shared/CoursePage/CoursePage";
import CreateCoupons from "../pages/Private/Instructor/CreateCoupons/CreateCoupons";
import CreateCoursePage from "../pages/Private/Instructor/CreateCourse/CreateCoursePage";
import DiscoverPage from "../pages/Private/Shared/DiscoverPage/DiscoverPage";
import EditProfilePage from "../pages/Private/Shared/EditProfilePage/EditProfilePage";
import HelpCenter from "../pages/Public/Blog/HelpCenter";
import HomeInstructor from "../pages/Private/Instructor/HomeInstructor/HomeInstructor";
import LandingPageHome from "../pages/Public/LandingPageHome/LandingPageHome";
import LearnPage from "../pages/Private/Student/LearnPage/LearnPage";
import LessonPage from "../pages/Private/Student/LessonPage/LessonPage";
import LoginBox from "../pages/Public/AuthPage/LoginBox/LoginBox";
import Messages from "../pages/Private/Instructor/Messages/Messages";
import MyCoursesPage from "../pages/Private/Shared/MyCoursesPage/MyCoursesPage";
import NotificationsPage from "../pages/Private/Shared/NotificationsPage/NotificationsPage";
import PaymentFailure from "../pages/Private/Student/PostPayment/PaymentFailure";
import PaymentMethods from "../pages/Private/Instructor/PaymentMethods/PaymentMethods";
import RoleSelection from "../pages/Private/Student/RoleSelection/RoleSelection";
import SearchPage from "../pages/Private/Student/SearchPage/SearchPage";
import SignupBox from "../pages/Public/AuthPage/SignupBox/SignupBox";
import SuccessfulPurchase from "../pages/Private/Student/PostPayment/SuccessfulPurchase";
import UserProfilePage from "../pages/Private/Shared/UserProfilePage/UserProfilePage";
import WishlistPage from "../pages/Private/Student/WishlistPage/WishlistPage";
import StatisticsPage from "../pages/Private/Business/StatisticsPage/StatisticsPage";
import TeachPage from "../pages/Public/TeachPage/TeachPage";
import BlogPage from "../pages/Public/Blog/BlogPage";
import Contact from "../pages/Public/Contact/Contact";
import EditCoursePage from "../pages/Private/Instructor/EditCourse/EditCoursePage";
import FAQPage from "../pages/Private/Business/FAQ/FAQPage";
import InsSignupBox from "../pages/Public/AuthPage/InsSignupBox/InsSignupBox";
import InstitutionsPage from "../pages/Public/InstitutionsPage/InstitutionsPage";
import HomeInstitutions from "../pages/Private/Institutions/HomeInstitutions/HomeInstitutions";
import SupraContainer from "../components/NavigationBars/SupraContainer";
import ManageInstructors from "../pages/Private/Institutions/ManageInstructors/ManageInstructors";
import Policy from "../pages/Public/PolicyTerms/Policy";
import Terms from "../pages/Public/PolicyTerms/Terms";
import CreateConferencePage from "../pages/Private/Instructor/CreateConference/CreateConferencePage";
import ConferencePage from "../pages/Private/Student/ConferencePage/ConferencePage";
import Meeting from "../pages/Private/Student/ConferencePage/Meeting";
import Close from "../pages/Private/Student/ConferencePage/Close";

const AppRouter = () => {
  const { userData, loadingInfo } = useContext(UserDataContext);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Public */}

        {!loadingInfo && (
          <>
            <Route path="/" element={<LandingPageHome />} />
          </>
        )}

        <Route path="/business" element={<BusinessPage />} />
        <Route path="/institutions" element={<InstitutionsPage />} />
        <Route path="/teach" element={<TeachPage />} />
        <Route path="/privacy" element={<Policy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<BlogPage />}>
          <Route path=":id" element={<Article />} />
        </Route>

        {/* Auth */}

        <Route path="/auth" element={<AuthPage />}>
          <Route index element={<Navigate to={"login"} />} />
          <Route path="login" element={<LoginBox />} />
          <Route path="google/callback" element={<></>} />
          <Route path="signup" element={<SignupBox />} />
          <Route path="account-recovery" element={<AccountRecoveryBox />} />
          <Route path="*" element={<Navigate to={"login"} />} />

          <Route path="login-institutions" element={<LoginBox />} />
          <Route path="signup-institutions" element={<SignupBox />} />
        </Route>

        <Route path="/ins-auth" element={<AuthPage institutions />}>
          <Route index element={<Navigate to={"login"} />} />
          <Route path="login" element={<LoginBox institutions />} />
          <Route path="signup" element={<InsSignupBox />} />
          <Route path="*" element={<Navigate to={"login"} />} />
        </Route>

        {/* Private */}
        {userData.jwt && (
          <>
            {userData.info && (
              <>
                <Route path="/role" element={userData.instructor ? <RoleSelection /> : <Navigate to={"/"} />} />

                {userData.mode === "instructor" && (
                  <Route path="/" element={<SupraContainer mode={"instructor"} />}>
                    <Route index element={<HomeInstructor />} />
                    <Route path="create-course" element={<CreateCoursePage />} />
                    <Route path="create-conference" element={<CreateConferencePage />} />
                    <Route path="payments" element={<PaymentMethods />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="coupons" element={<CreateCoupons />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="my-courses" element={<MyCoursesPage />} />
                    <Route path="user/:slug" element={<UserProfilePage />} />
                    <Route path="edit-profile" element={<EditProfilePage />} />
                    <Route path="/edit-course/:courseID" element={<EditCoursePage />} />
                    <Route path="conference/:slug" element={<ConferencePage instructor />} />
                    <Route path="*" element={<Navigate to={"/"} />} />
                  </Route>
                )}

                {userData.company ? (
                  <Route path="/" element={<SupraContainer mode={"business"} />}>
                    <Route index element={<DiscoverPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="add-users" element={<AddUsers />} />
                    <Route path="course/:slug" element={<CoursePage />} />
                    <Route path="courses/:category" element={<AdvancedSearchPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="courses/:category/:subcategory" element={<AdvancedSearchPage />} />
                    <Route path="my-courses" element={<MyCoursesPage />} />
                    <Route path="statistics" element={<StatisticsPage />} />
                    <Route path="user/:slug" element={<UserProfilePage />} />
                    <Route path="edit-profile" element={<EditProfilePage mode={"company"} />} />

                    {/* After payment */}
                    <Route path="payment-failure" element={<PaymentFailure />} />
                    <Route path="successful-purchase" element={<SuccessfulPurchase />} />
                    <Route path="payment-success" element={<SuccessfulPurchase />} />

                    <Route path="*" element={<Navigate to={"/"} />} />
                  </Route>
                ) : userData.institution ? (
                  <Route path="/" element={<SupraContainer mode={"institution"} />}>
                    <Route index element={<HomeInstitutions />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="manage-instructors" element={<ManageInstructors />} />
                    <Route path="course/:slug" element={<CoursePage />} />
                    <Route path="courses/:category" element={<AdvancedSearchPage />} />
                    <Route path="courses/:category/:subcategory" element={<AdvancedSearchPage />} />
                    <Route path="user/:slug" element={<UserProfilePage />} />
                    <Route path="edit-profile" element={<EditProfilePage mode={"institution"} />} />

                    <Route path="*" element={<Navigate to={"/"} />} />
                  </Route>
                ) : (
                  // Student
                  <>
                    <Route path="conference/join" element={<Meeting />} />
                    <Route path="conference/exit" element={<Close />} />

                    <Route path="/" element={<SupraContainer mode={"student"} />}>
                      <Route index element={<DiscoverPage />} />

                      <Route path="conference/:slug" element={<ConferencePage />} />

                      <Route path="course/:slug" element={<CoursePage />} />
                      <Route path="course/:slug/learn" element={<LearnPage />} />
                      <Route path="course/:slug/learn/lesson/:lessonId" element={<LessonPage />} />

                      <Route path="courses" element={<SearchPage />} />
                      <Route path="courses/:category" element={<AdvancedSearchPage />} />
                      <Route path="courses/:category/:subcategory" element={<AdvancedSearchPage />} />

                      <Route path="conferences" element={<SearchPage />} />
                      <Route path="conferences/:category" element={<AdvancedSearchPage conference />} />
                      <Route path="conferences/:category/:subcategory" element={<AdvancedSearchPage conference />} />

                      <Route path="cart" element={<CartPage />} />
                      <Route path="my-courses" element={<MyCoursesPage />} />
                      <Route path="search" element={<SearchPage />} />
                      <Route path="user/:slug" element={<UserProfilePage />} />
                      <Route path="edit-profile" element={<EditProfilePage />} />
                      <Route path="wishlist" element={<WishlistPage />} />
                      <Route path="wishlist/:listID" element={<WishlistPage />} />
                      <Route path="notifications" element={<NotificationsPage />} />
                      <Route path="payment-failure" element={<PaymentFailure />} />
                      <Route path="successful-purchase" element={<SuccessfulPurchase />} />
                      <Route path="chat" element={<ChatPage />} />
                      <Route path="*" element={<Navigate to={"/"} />} />
                    </Route>
                  </>
                )}
              </>
            )}

            <Route path="*" element={<SpinnerOfDoom standalone center full />} />
          </>
        )}

        <Route path="/help" element={<HelpCenter />}>
          <Route path=":id" element={<Article />} />
        </Route>

        {/* Not Found: 404 */}
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
