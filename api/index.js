

const BASE_URL = 'http://localhost:3000/api/v1';

// a library to wrap and simplify api calls
import apisauce from 'apisauce'

// our "constructor"
const create = (baseURL = BASE_URL) => {
  // ------
  // STEP 1s
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Content-type' : 'application/json'
    },
    // 30 second timeout...
    timeout: 30000
  })

  // Force OpenWeather API Key on all requests
  // api.addRequestTransform((request) => {
  //   request.params['APPID'] = '0e44183e8d1018fc92eb3307d885379c'
  // })

  // Wrap api's addMonitor to allow the calling code to attach
  // additional monitors in the future.  But only in __DEV__ and only
  // if we've attached Reactotron to console (it isn't during unit tests).
  
  /* if (__DEV__ && console.tron) {
    api.addMonitor(console.tron.apisauce)
  }*/

  api.addAsyncRequestTransform(request => async () => {
	const accessToken = await AsyncStorage.getItem('token')
	if(accessToken){
		request.headers['Authorization'] = accessToken;
	}
  })

  api.addMonitor((response) => {
    if(response.status === 401 &&
      response.data && response.data.error &&
      response.data.error.code === 'INVALID_TOKEN'){
		  console.log('Invalid token')
    }
  })

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //

  const userLogin = (credentials) => api.post(`/users/login?include=user`, credentials)

  const registerDevice = (data) => api.post('/users/register-device', data, {timeout: 50000})

  const userLogout = () => api.post('/users/logout')

  const userRegister = (data) => api.post('/users', data)

  const updateProfile = (data) => api.patch('/users/me', data)

  const resetPassword = (data) => api.post('/users/reset', data)

  const getNotifications = () => api.get('/users/me/notifications')

  const getNotificationById = (id) => api.get(`/users/me/notifications/${id}`)

  const getFriendsRequests = () => api.get('/users/friends-requests')

  const getUserProfile = (id = 'me') => api.get(`/users/${id}/profile`)

  const searchUsers = (query) => api.get(`/users/search?query=${query}`)

  const getUserFriends = (id = 'me') => api.get(`/users/${id}/list-friends`)

  const addFriendById = (id) => api.post(`/users/${id}/add-friend`)

  const removeFriendById = (id) => api.post(`/users/${id}/unfriend`)

  const blockUserById = (id) => api.post(`/users/${id}/block`)

  const unblockUserById = (id) => api.post(`/users/${id}/unblock`)

  const checkFriendship = (id) => api.get(`/users/${id}/check-friendship`)

  const getUserAvatar = (id, redirect=true, size=small) => api.get(`/users/${id}/avatar?s=${size}&redirect=${redirect ? 'true': 'false' }`)

  const setAlarm = (data) => api.post('/alarms', data)

  const getFriendsAlarms = () => api.get('/alarms/friends-alarms')

  const getAlarmById = (id) => api.get(`/alarms/${id}`)

  const updateAlarmById = (id, data) => api.patch(`/alarms/${id}`, data)

  const removeAlarmById = (id) => api.delete(`/alarms/${id}`)

  const turnOffAlarmById = (id) => api.post(`/alarms/${id}/turn-off`)

  const calcAlarmSignature = (id) => api.get(`/alarms/${id}/calc-signature`)

  const sendVoiceNote = (data) => api.post('/alarms/send-voice-note', data)

  const getCurrentAlarm = (userId = 'me') => api.get(`/users/${userId}/currentAlarm`)

  const getVoiceNote = (alarmId, voiceNoteId) => api.get(`/alarms/${alarmId}/voicenotes/${voiceNoteId}`)

  const getVoiceNotes = (alarmId, filter = {}) => api.get(`/alarms/${alarmId}/voicenotes?filter=${JSON.stringify({include: 'sender', ...filter})}`)

  const markVoiceNoteAsListened = (alarmId, voiceNoteId) => api.post(`/alarms/${alarmId}/voicenotes/${voiceNoteId}/mark-as-listened`)

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    userLogin,
    registerDevice,
    userLogout,
    userRegister,
    resetPassword,
    updateProfile,
    getNotifications,
    getNotificationById,
    getFriendsRequests,
    getFriendsAlarms,
    getUserProfile,
    searchUsers,
    getUserFriends,
    addFriendById,
    removeFriendById,
    blockUserById,
    unblockUserById,
    checkFriendship,
    getUserAvatar,
    setAlarm,
    getAlarmById,
    updateAlarmById,
    removeAlarmById,
    turnOffAlarmById,
    calcAlarmSignature,
    sendVoiceNote,
    getCurrentAlarm,
    getVoiceNotes,
    markVoiceNoteAsListened
  }
}

// let's return back our create method as the default.
export default {
  create
}