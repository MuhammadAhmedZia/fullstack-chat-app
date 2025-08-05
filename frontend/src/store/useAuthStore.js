import {create} from 'zustand'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
const BaseUrl = import.meta.env.MODE === "development" ? 'http://localhost:5000' :"/"

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile:false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth:async () => {
        try {
            const res = await  axiosInstance.get('/auth/check') ;
            set({authUser: res.data});
            get().socketConnected()
        } catch (error) {
            console.log("Error Occurr In CheckAuth Function", error);
            set({authUser: null});
        }finally{
            set({isCheckingAuth: false});
        }
    },
    signup: async (data) => {
        set({isSigningUp : true});
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({authUser: res.data});
            toast.success("Account Create Successfully")
            get().socketConnected()
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isSigningUp: false})
        }
    },
    login: async (data) => {
        set({isLoggingIn : true});
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({authUser: res.data});
            toast.success("Loged In Successfully")
            get().socketConnected()
        } catch (error) {
           toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn: false})
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
        set({authUser: null});
        toast.success("Logout Successfully")
        get().socketDisconnected();
        } catch (error) {
            toast.error(error.response.data.message)
        }

    },
    updateProfile : async (data) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put('/auth/updateprofile', data)
            set({authUser : res.data})
            toast.success("Update Profile Successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    socketConnected : () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return

        const socket = io(BaseUrl, {
            query: {
                userId: authUser._id,
            }
        });
        socket.connect();

        set({socket: socket});

        socket.on('getOnlineUsers',(userIds) =>{
            set({onlineUsers: userIds})
        })
    }, 
    socketDisconnected : () => {
        if( get().socket?.connected) get().socket.disconnect();
    }   
    

}))