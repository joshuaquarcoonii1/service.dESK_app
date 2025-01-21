let currentUser = '';

export const setCurrentUser = (username) => {
  currentUser = username;
};

export const getCurrentUser = () => currentUser;


//get contact
let userContact="";

export const setUserContact =(contact)=>{
  userContact=contact;
};
export const getUserContact=()=>userContact;