import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import WriterLayout from './layouts/WriterLayout.jsx';
import WriterLogin from './pages/Writer/WriterLogin.jsx';
import 'antd/dist/reset.css';
import WriterHome from './pages/Writer/WriterHome.jsx';
import './components/routes/AntiProtectedRoute.jsx';
import './components/routes/ProtectedRoute.jsx';
import './components/routes/RoleBasedRoute.jsx';
import AntiProtectedRoute from './components/routes/AntiProtectedRoute.jsx';
import RoleBasedRoute from './components/routes/RoleBasedRoute.jsx';
import ROLES from './utils/constants/roles.js';
import WriterCreateBlog from './pages/Writer/WriterCreateBlog.jsx';
import WriterBlogDetail from './pages/Writer/WriterBlogDetail.jsx';
import WriterBlogEdit from './pages/Writer/WriterBlogEdit.jsx';
import WriterAccount from './pages/Writer/WriterAccount.jsx';
import VerifyLayout from './layouts/VerifyLayout.jsx';
import GenerateResetPassword from './pages/Verification/GenerateResetPassword.jsx';
import NotFound from './components/NotFound.jsx';
import ConfirmResetPassword from './pages/Verification/ConfirmResetPassword.jsx';
import ConfirmAccount from './pages/Verification/ConfirmAccount.jsx';
import ConfirmDeleteAccount from './pages/Verification/ConfirmDeleteAccount.jsx';
import ConfirmEmailUpdate from './pages/Verification/ConfirmEmailUpdate.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminLogin from './pages/Admin/AdminLogin.jsx';
import BrandPage from './pages/Brand/BrandPage.jsx';
import CreateBrand from './pages/Brand/CreateBrand.jsx';
import BrandDetail from './pages/Brand/BrandDetail.jsx';
import AdminAccount from './pages/Admin/AdminAccount.jsx';
import TeamMemberPage from './pages/Team Member/TeamMemberPage.jsx';
import TeamMemberCreate from './pages/Team Member/CreateTeamMember.jsx';
import TeamMemberDetail from './pages/Team Member/TeamMemberDetail.jsx';
import BannerPage from './pages/Banner/BannerPage.jsx';
import CreateBannerPage from './pages/Banner/CreateBanner.jsx';
import BannerDetail from './pages/Banner/BannerDetails.jsx';
import AnnouncementPage from './pages/Announcement/AnnouncementPage.jsx';
import CreateAnnouncement from './pages/Announcement/CreateAnnouncement.jsx';
import AnnouncementDetail from './pages/Announcement/AnnouncementDetail.jsx';
import ProductTypePage from './pages/Product Type/ProductTypePage.jsx';
import ProductTypeDetail from './pages/Product Type/ProductTypeDetails.jsx';
import CategoryPage from './pages/Category/CategoryPage.jsx';
import CreateCategory from './pages/Category/CreateCategory.jsx';
import CategoryDetail from './pages/Category/CategoryDetail.jsx';
import UserPage from './pages/User/UserPage.jsx';
import CreateUser from './pages/User/UserCreate.jsx';
import UserDetail from './pages/User/UserDetails.jsx';
import BlogPage from './pages/Blog/BlogPage.jsx';
import CreateBlog from './pages/Blog/CreateBlog.jsx';
import BlogDetail from './pages/Blog/BlogDetail.jsx';
import BlogEditPage from './pages/Blog/BlogEdit.jsx';
import CommentPage from './pages/Comment/CommentPage.jsx';
import CreateDiscount from './pages/Discount/CreateDiscount.jsx';
import DiscountDetail from './pages/Discount/DiscountDetail.jsx';
import DiscountPage from './pages/Discount/DiscountPage.jsx';
import CreateProduct from './pages/Product/CreateProduct.jsx';
import ProductDetail from './pages/Product/ProductDetail.jsx';
import ProductPage from './pages/Product/ProductPage.jsx';
import ReviewPage from './pages/Review/ReviewPage.jsx';
import CurrencyPage from './pages/Currency/CurrencyPage.jsx';
import CreateComment from './pages/Comment/CreateComment.jsx';
import CreateReview from './pages/Review/CreateReview.jsx';

const router = createBrowserRouter([
  {
    path: 'writer',
    element: <WriterLayout />,
    children: [
      {
        path: 'login',
        element: (
          <AntiProtectedRoute redirectPath={'/writer'} >
            <WriterLogin />
          </AntiProtectedRoute>
        )
      },
      {
        path: '',
        element: (
          <RoleBasedRoute loginPath={'/writer/login'} redirectPath={'/'} roleID={ROLES.WRITER} >
            <WriterHome />
          </RoleBasedRoute>
        )
      },
      {
        path: 'blog/create',
        element: (
          <RoleBasedRoute loginPath={'/writer/login'} redirectPath={'/'} roleID={ROLES.WRITER} >
            <WriterCreateBlog />
          </RoleBasedRoute>
        )
      },
      {
        path: 'blog/:id',
        element: (
          <RoleBasedRoute loginPath={'/writer/login'} redirectPath={'/'} roleID={ROLES.WRITER} >
            <WriterBlogDetail />
          </RoleBasedRoute>
        )
      },
      {
        path: 'blog/edit/:id',
        element: (
          <RoleBasedRoute loginPath={'/writer/login'} redirectPath={'/'} roleID={ROLES.WRITER} >
            <WriterBlogEdit />
          </RoleBasedRoute>
        )
      },


      {
        path: 'account',
        element: (
          <RoleBasedRoute loginPath={'/writer/login'} redirectPath={'/'} roleID={ROLES.WRITER} >
            <WriterAccount />
          </RoleBasedRoute>
        )
      }
    ]
  },


  {
    path: '/',
    element: <h1>Welcome to Codelandia</h1>
  },


  {
    path: 'verify',
    element: <VerifyLayout />,
    children: [
      {
        path: 'reset-password',
        element: <GenerateResetPassword />
      },
      {
        path: 'reset-password/:token',
        element: <ConfirmResetPassword />
      },
      {
        path: 'account/:token',
        element: <ConfirmAccount />
      },
      {
        path: 'delete-account/:token',
        element: <ConfirmDeleteAccount />
      },
      {
        path: 'email/:token',
        element: <ConfirmEmailUpdate />
      },
      {
        path: '*',
        element: <NotFound isData={false} />
      }
    ]
  },


  {
    path: 'admin',
    element: (
      <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
        <AdminLayout />
      </RoleBasedRoute>
    ),
    children: [
      {
        path: '',
        element: (<Navigate to={'/admin/account'} />)
      },

      
      {
        path: 'brand',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <BrandPage />
          </RoleBasedRoute>
        )
      },
      {
        path: 'brand/create',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <CreateBrand />
          </RoleBasedRoute>
        )
      },
      {
        path: 'brand/:id',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <BrandDetail />
          </RoleBasedRoute>
        )
      },


      {
        path: 'team-member',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <TeamMemberPage />
          </RoleBasedRoute>
        )
      },
      {
        path: 'team-member/create',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <TeamMemberCreate />
          </RoleBasedRoute>
        )
      },
      {
        path: 'team-member/:id',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <TeamMemberDetail />
          </RoleBasedRoute>
        )
      },


      {
        path: 'banner',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <BannerPage />
          </RoleBasedRoute>
        )
      },
      {
        path: 'banner/create',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <CreateBannerPage />
          </RoleBasedRoute>
        )
      },
      {
        path: 'banner/:id',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <BannerDetail />
          </RoleBasedRoute>
        )
      },


      {
        path: 'announcement',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <AnnouncementPage />
          </RoleBasedRoute>
        )
      },
      {
        path: 'announcement/create',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <CreateAnnouncement />
          </RoleBasedRoute>
        )
      },
      {
        path: 'announcement/:id',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <AnnouncementDetail />
          </RoleBasedRoute>
        )
      },


      {
        path: 'product-type',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <ProductTypePage />
          </RoleBasedRoute>
        )
      },
      {
        path: 'product-type/:id',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <ProductTypeDetail />
          </RoleBasedRoute>
        )
      },


      {
        path: 'category',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <CategoryPage />
          </RoleBasedRoute>
        )
      },
      {
        path: 'category/create',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <CreateCategory />
          </RoleBasedRoute>
        )
      },
      {
        path: 'category/:id',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <CategoryDetail />
          </RoleBasedRoute>
        )
      },


      {
        path: 'user',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <UserPage />
          </RoleBasedRoute>
        )
      },
      {
        path: 'user/create',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <CreateUser />
          </RoleBasedRoute>
        )
      },
      {
        path: 'user/:id',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <UserDetail />
          </RoleBasedRoute>
        )
      },


      {
        path: 'blog',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <BlogPage />
          </RoleBasedRoute>
        )
      },
      {
        path: 'blog/create',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <CreateBlog />
          </RoleBasedRoute>
        )
      },
      {
        path: 'blog/edit/:id',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <BlogEditPage />
          </RoleBasedRoute>
        )
      },
      {
        path: 'blog/:id',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <BlogDetail />
          </RoleBasedRoute>
        )
      },


      {
        path: 'comment',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <CommentPage />
          </RoleBasedRoute>
        )
      },
      {
        path: 'comment/create',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <CreateComment />
          </RoleBasedRoute>
        )
      },


      {
        path: 'discount/create',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <CreateDiscount />
          </RoleBasedRoute>
        )
      },
      {
        path: 'discount/:id',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <DiscountDetail />
          </RoleBasedRoute>
        )
      },
      {
        path: 'discount',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <DiscountPage />
          </RoleBasedRoute>
        )
      },


      {
        path: 'product/create',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <CreateProduct />
          </RoleBasedRoute>
        )
      },
      {
        path: 'product/:id',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <ProductDetail />
          </RoleBasedRoute>
        )
      },
      {
        path: 'product',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <ProductPage />
          </RoleBasedRoute>
        )
      },


      {
        path: 'review',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <ReviewPage />
          </RoleBasedRoute>
        )
      },
      {
        path: 'review/create',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <CreateReview />
          </RoleBasedRoute>
        )
      },


      {
        path: 'currency',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <CurrencyPage />
          </RoleBasedRoute>
        )
      },
      

      {
        path: 'account',
        element: (
          <RoleBasedRoute roleID={ROLES.ADMIN} loginPath={'/admin/login'} redirectPath={'/'}>
            <AdminAccount />
          </RoleBasedRoute>
        )
      }
    ]
  },

  {
    path: 'admin/login',
    element: (
      <AntiProtectedRoute redirectPath={'/admin'} >
        <AdminLogin />
      </AntiProtectedRoute>
    )
  },

  {
    path: '*',
    element: (<NotFound isData={false} />)
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>
);