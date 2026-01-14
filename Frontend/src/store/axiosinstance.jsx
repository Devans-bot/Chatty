import React from 'react'
import axios from 'axios'

export const axiosinstance=axios.create({
    baseURL:"/api",
    withCredentials:true,
})

