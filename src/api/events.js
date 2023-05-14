import api from "@/http-common";
import { collection, doc, setDoc, where, query, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore"; 
import { db } from '@/firebase';

export const getEvents = async () => {
  const q = query(collection(db, "events"));
  const querySnapshot = await getDocs(q);
  let events = [];
  querySnapshot.forEach((doc) => {
    events.push({
      id: doc.id,
      ...doc.data()
    })
  });
  return events;
}

export const getEvent = async (id) => {
  const q = query(collection(db, "events"), where("id", "==", id));
  const querySnapshot = await getDocs(q);
  let event = {};
  querySnapshot.forEach((doc) => {
    event = {
      id: doc.id,
      ...doc.data()
    }
  });
  return event;
}

export const createEvent = async (event) => {
  const newEvent = await addDoc(collection(db, "events"), event);
  return newEvent;
}

export const updateEvent = async (event) => {
  const eventRef = doc(db, "events", event.id);
  await updateDoc(eventRef, event);
}

export const deleteEvent = async (id) => {
  if (!id) return 500;
  await deleteDoc(doc(db, "events", id));
}