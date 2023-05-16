import api from "@/http-common";
import { collection, doc, setDoc, where, query, getDocs, addDoc, updateDoc, deleteDoc, orderBy, limit, onSnapshot } from "firebase/firestore"; 
import { db } from '@/firebase';

export const getTests = async () => {
  const q = query(collection(db, "tests"));
}

export const getTestsByEvent = async (eventId) => {
  const q = query(collection(db, "tests"), where("eventId", "==", eventId));
}

export const getTest = async (id) => {
  const q = query(collection(db, "tests"), where("id", "==", id));
}

export const createTest = async (test) => {
  const newTest = await addDoc(collection(db, "tests"), test);
  return newTest;
}

export const updateTest = async (test) => {
  const testRef = doc(db, "tests", test.id);
  await updateDoc(testRef, test);
}

export const deleteTest = async (id) => {
  if (!id) return {status:500};
  const testRef = doc(db, "tests", id);
  await deleteDoc(testRef);
  return {status:200};
}

export const getSortedTests = async (eventId, order="desc", status=null) => {
  let q = null
  console.log(eventId, order, status);
  if(status === null || status === "waitingForCounseling")
    q = query(collection(db, "tests"), where("eventId", "==", eventId), orderBy("createdAt", order));
  else
    q = query(collection(db, "tests"), where("eventId", "==", eventId), orderBy("updatedAt", order));

  const querySnapshot = await getDocs(q);
  let tests = [];
  querySnapshot.forEach((doc) => {
    tests.push({
      id: doc.id,
      ...doc.data()
    })
  });

  return tests;
}

export const getFilteredTests = async (status, eventId, order="desc", doctorId=null) => {
  let tests = await getSortedTests(eventId, order);

  if (tests.length > 0) {
    if(doctorId !== null) tests = tests.filter(t => t.doctorId === doctorId);
    if(status !== null) tests = tests.filter(t => t.status === status);
  }

  return tests;
}

export const getLatestTest = async (status, eventId, order="desc", doctorId=null) => {
  const filteredTests = await getFilteredTests(status, eventId, order, doctorId);

  let latestTest = null;
  if (filteredTests.length > 0) {
    latestTest = filteredTests[0];
  }
  
  return latestTest;
}

  // if(status === undefined || eventId === undefined) return null;
  // let q = query(collection(db, "tests"), where("eventId", "==", eventId));
  
  // if(doctorId !== null && status !== null)
  //   q = query(collection(db, "tests"), where("eventId", "==", eventId), where("status", "==", status), where("doctorId", "==", doctorId));
  // else if(status !== null)
  //   q = query(collection(db, "tests"), where("eventId", "==", eventId), where("status", "==", status));
  
  // const querySnapshot = await getDocs(q);
  // let tests = [];
  // querySnapshot.forEach((doc) => {
  //   tests.push({
  //     id: doc.id,
  //     ...doc.data()
  //   })
  // });
  // if (tests.length > 0) {
  //   const sortedTests = tests.sort((a, b) => {
  //     if (order === 'asc') return a.createdAt - b.createdAt;
  //     else return b.createdAt - a.createdAt;
  //   });
  //   return sortedTests[0];
  // }
  // return null;
// }

export const getNextTestToLine = async (eventId, status, order, doctorId=null) => {
  const t = await getLatestTest(status, eventId, order, doctorId);
  return t;
}

export const getTestsByDoctorId = async (doctorId, eventId) => {
  const q = query(collection(db, "tests"), where("doctorId", "==", doctorId), where("eventId", "==", eventId));
  const querySnapshot = await getDocs(q);
  let tests = [];
  querySnapshot.forEach((doc) => {
    tests.push({
      id: doc.id,
      ...doc.data()
    })
  });
  return tests;
}