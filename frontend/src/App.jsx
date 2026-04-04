import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import HomePage         from './pages/marketplace/HomePage'
import ListingPage      from './pages/marketplace/ListingPage'
import ProductPage      from './pages/marketplace/ProductPage'
import StorePage        from './pages/marketplace/StorePage'
import CheckoutPage     from './pages/marketplace/CheckoutPage'
import OrdersPage       from './pages/marketplace/OrdersPage'
import PaymentVerifyPage from './pages/marketplace/PaymentVerifyPage'
import LoginPage        from './pages/auth/LoginPage'
import RegisterPage     from './pages/auth/RegisterPage'
import VendorLayout     from './pages/vendor/VendorLayout'
import VendorOverview   from './pages/vendor/VendorOverview'
import VendorProducts   from './pages/vendor/VendorProducts'
import VendorOrders     from './pages/vendor/VendorOrders'
import VendorCustomers  from './pages/vendor/VendorCustomers'
import VendorDiscounts  from './pages/vendor/VendorDiscounts'
import VendorWhatsApp   from './pages/vendor/VendorWhatsApp'
import VendorAI         from './pages/vendor/VendorAI'
import VendorSocial     from './pages/vendor/VendorSocial'
import VendorPayouts    from './pages/vendor/VendorPayouts'
import VendorAnalytics  from './pages/vendor/VendorAnalytics'
import VendorSettings   from './pages/vendor/VendorSettings'
import AdminLayout      from './pages/admin/AdminLayout'
import AdminOverview    from './pages/admin/AdminOverview'
import AdminVendors     from './pages/admin/AdminVendors'
import AdminUsers       from './pages/admin/AdminUsers'
import AdminProducts    from './pages/admin/AdminProducts'
import AdminPayments    from './pages/admin/AdminPayments'
import AdminAnalytics   from './pages/admin/AdminAnalytics'
import AdminSettings    from './pages/admin/AdminSettings'

function Guard({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',fontFamily:'DM Sans,sans-serif',color:'#666',fontSize:14 }}>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/"                element={<HomePage/>}/>
      <Route path="/products"        element={<ListingPage/>}/>
      <Route path="/product/:id"     element={<ProductPage/>}/>
      <Route path="/store/:slug"     element={<StorePage/>}/>
      <Route path="/checkout"        element={<CheckoutPage/>}/>
      <Route path="/payment/verify"  element={<PaymentVerifyPage/>}/>
      <Route path="/orders"          element={<Guard><OrdersPage/></Guard>}/>
      <Route path="/login"           element={<LoginPage/>}/>
      <Route path="/register"        element={<RegisterPage/>}/>

      <Route path="/vendor" element={<Guard role="vendor"><VendorLayout/></Guard>}>
        <Route index              element={<Navigate to="overview" replace/>}/>
        <Route path="overview"   element={<VendorOverview/>}/>
        <Route path="products"   element={<VendorProducts/>}/>
        <Route path="orders"     element={<VendorOrders/>}/>
        <Route path="customers"  element={<VendorCustomers/>}/>
        <Route path="discounts"  element={<VendorDiscounts/>}/>
        <Route path="whatsapp"   element={<VendorWhatsApp/>}/>
        <Route path="ai"         element={<VendorAI/>}/>
        <Route path="social"     element={<VendorSocial/>}/>
        <Route path="payouts"    element={<VendorPayouts/>}/>
        <Route path="analytics"  element={<VendorAnalytics/>}/>
        <Route path="settings"   element={<VendorSettings/>}/>
      </Route>

      <Route path="/admin" element={<Guard role="admin"><AdminLayout/></Guard>}>
        <Route index             element={<Navigate to="overview" replace/>}/>
        <Route path="overview"   element={<AdminOverview/>}/>
        <Route path="vendors"    element={<AdminVendors/>}/>
        <Route path="users"      element={<AdminUsers/>}/>
        <Route path="products"   element={<AdminProducts/>}/>
        <Route path="payments"   element={<AdminPayments/>}/>
        <Route path="analytics"  element={<AdminAnalytics/>}/>
        <Route path="settings"   element={<AdminSettings/>}/>
      </Route>

      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  )
}
