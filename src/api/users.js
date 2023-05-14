import api from "@/http-common";
import { collection, doc, setDoc, where, query, getDocs, addDoc, updateDoc, deleteDoc, orderBy } from "firebase/firestore"; 
import { db } from '@/firebase';

export const getUsers = async () => {
  const q = query(collection(db, "users"), orderBy("role"), orderBy("name"));
  const querySnapshot = await getDocs(q);
  let users = [];
  querySnapshot.forEach((doc) => {
    users.push({
      id: doc.id,
      ...doc.data()
    })
  });
  return users;
}

export const getUser = async (id) => {
  const q = query(collection(db, "users"), where("id", "==", id));
  const querySnapshot = await getDocs(q);
  let user = {};
  querySnapshot.forEach((doc) => {
    user = {
      id: doc.id,
      ...doc.data()
    }
  });
  return user;
}

export const createUser = async (user) => {
  const users = await getUsersByRole(user.role);

  const roles = {
    "admin": "Amministratore",
    "doctor": "Medico",
    "counselor": "Counselor",
    "receptionist": "Accoglienza"
  }
  
  let lastPublicName = ''
  if (users.length > 0) {
    const pn = (users[users.length - 1].publicName).split(' ');
    lastPublicName = [pn[0], Number(pn[1])+1].join(' ');
  } else {
    lastPublicName = roles[user.role] + ' 1';
  }
  user.publicName = lastPublicName;

  const newUser = await addDoc(collection(db, "users"), user);
  return newUser;
}

export const updateUser = async (user) => {
  const userRef = doc(db, "users", user.id);
  await updateDoc(userRef, user);
}

export const deleteUser = async (id) => {
  if (!id) return 500;
  await deleteDoc(doc(db, "users", id));
}

export const loginUser = async (email, password) => {
  try{
    const user = await getUserByEmail(email);

    if (!user) return {satus: 404};

    if(user.password !== password) return {status: 401};
    else {
      return {status: 200, user};
    }
  } catch (err) {
    console.error(err);
    return err;
  }

}

const getUserByEmail = async (email) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  let user = {};
  querySnapshot.forEach((doc) => {
    user = {
      id: doc.id,
      ...doc.data()
    }
  });
  return user;
}

const getUsersByRole = async (role) => {
  const q = query(collection(db, "users"), where("role", "==", role));
  const querySnapshot = await getDocs(q);
  let users = [];
  querySnapshot.forEach((doc) => {
    users.push({
      id: doc.id,
      ...doc.data()
    })
  });
  users.sort((a, b) => (a?.publicName > b?.publicName) ? 1 : -1);
  return users;
}