import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Compare from './pages/Compare';
import EmiCalculator from './pages/EmiCalculator';
import Apply from './pages/Apply';
import Category from './pages/Category';
import Location from './pages/Location';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import DynamicPage from './pages/DynamicPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/compare" element={<Layout><Compare /></Layout>} />
        <Route path="/calculator" element={<Layout><EmiCalculator /></Layout>} />
        <Route path="/apply" element={<Layout><Apply /></Layout>} />
        <Route path="/loans/:slug" element={<Layout><Category /></Layout>} />
        <Route path="/loans-in/:slug" element={<Layout><Location /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/legal/:slug" element={<Layout><Legal /></Layout>} />
        <Route path="/p/:slug" element={<Layout><DynamicPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
