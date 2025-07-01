import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import NewsTicker from './components/News'; // Import the News components
import 'react-datepicker/dist/react-datepicker.css';
import './App.css'; // Import the CSS