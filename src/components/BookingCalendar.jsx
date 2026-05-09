import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import BOOKINGS_DATA from "../booking.json";

// ─── EMBEDDED BOOKING DATA ────────────────────────────────────────────────────
// const BOOKINGS_DATA = [
//   { id:"BK1000",guestName:"James Davis",roomNumber:"102",roomType:"Standard",checkIn:"2026-01-01",checkOut:"2026-01-04",guests:2,totalAmount:13500,currency:"INR",status:"cancelled",source:"Expedia" },
//   { id:"BK1001",guestName:"Mason Sato",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-01-01",checkOut:"2026-01-03",guests:2,totalAmount:44000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1002",guestName:"Mateo Gupta",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-01-02",checkOut:"2026-01-16",guests:1,totalAmount:105000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1003",guestName:"Isabella Tanaka",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-01-02",checkOut:"2026-01-03",guests:2,totalAmount:7500,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1004",guestName:"Isabella Müller",roomNumber:"301",roomType:"Suite",checkIn:"2026-01-02",checkOut:"2026-01-04",guests:2,totalAmount:24000,currency:"INR",status:"checked_out",source:"Direct" },
//   { id:"BK1005",guestName:"Aditya Reddy",roomNumber:"101",roomType:"Standard",checkIn:"2026-01-03",checkOut:"2026-01-04",guests:2,totalAmount:4500,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1006",guestName:"Aditya Brown",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-01-03",checkOut:"2026-01-06",guests:2,totalAmount:22500,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1007",guestName:"Karan Rossi",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-01-03",checkOut:"2026-01-07",guests:3,totalAmount:88000,currency:"INR",status:"checked_out",source:"Agoda" },
//   { id:"BK1008",guestName:"Rahul Tanaka",roomNumber:"302",roomType:"Suite",checkIn:"2026-01-04",checkOut:"2026-01-08",guests:1,totalAmount:48000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1009",guestName:"Diya Wang",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-01-04",checkOut:"2026-01-08",guests:2,totalAmount:88000,currency:"INR",status:"checked_out",source:"Direct" },
//   { id:"BK1010",guestName:"Ethan Johnson",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-01-05",checkOut:"2026-01-08",guests:2,totalAmount:22500,currency:"INR",status:"checked_out",source:"Airbnb" },
//   { id:"BK1011",guestName:"Rohan Sharma",roomNumber:"101",roomType:"Standard",checkIn:"2026-01-06",checkOut:"2026-01-09",guests:2,totalAmount:13500,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1012",guestName:"Siddharth Davis",roomNumber:"301",roomType:"Suite",checkIn:"2026-01-06",checkOut:"2026-01-09",guests:2,totalAmount:36000,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1013",guestName:"Isabella Sato",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-01-07",checkOut:"2026-01-08",guests:2,totalAmount:7500,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1014",guestName:"Sophia Johnson",roomNumber:"302",roomType:"Suite",checkIn:"2026-01-08",checkOut:"2026-01-13",guests:2,totalAmount:60000,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1015",guestName:"Sophia Gupta",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-01-08",checkOut:"2026-01-18",guests:1,totalAmount:220000,currency:"INR",status:"checked_out",source:"Expedia" },
//   { id:"BK1016",guestName:"Sophia Khan",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-01-08",checkOut:"2026-01-09",guests:2,totalAmount:22000,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1017",guestName:"Carlos Johnson",roomNumber:"101",roomType:"Standard",checkIn:"2026-01-09",checkOut:"2026-01-13",guests:2,totalAmount:18000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1018",guestName:"Siddharth Tanaka",roomNumber:"102",roomType:"Standard",checkIn:"2026-01-09",checkOut:"2026-01-16",guests:3,totalAmount:31500,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1019",guestName:"Aditya Singh",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-01-09",checkOut:"2026-01-12",guests:2,totalAmount:22500,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1020",guestName:"Meera Johnson",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-01-09",checkOut:"2026-01-19",guests:2,totalAmount:220000,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1021",guestName:"James Reddy",roomNumber:"103",roomType:"Standard",checkIn:"2026-01-11",checkOut:"2026-01-12",guests:2,totalAmount:4500,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1022",guestName:"Kavya Gupta",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-01-12",checkOut:"2026-01-15",guests:3,totalAmount:22500,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1023",guestName:"Nisha Nair",roomNumber:"301",roomType:"Suite",checkIn:"2026-01-12",checkOut:"2026-01-16",guests:3,totalAmount:48000,currency:"INR",status:"checked_out",source:"Booking.com" },
//   { id:"BK1024",guestName:"Isabella Martinez",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-01-13",checkOut:"2026-01-27",guests:2,totalAmount:105000,currency:"INR",status:"cancelled",source:"Walk-in" },
//   { id:"BK1025",guestName:"Rahul Mehta",roomNumber:"302",roomType:"Suite",checkIn:"2026-01-14",checkOut:"2026-01-17",guests:3,totalAmount:36000,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1026",guestName:"Rahul Tanaka",roomNumber:"101",roomType:"Standard",checkIn:"2026-01-15",checkOut:"2026-01-20",guests:1,totalAmount:22500,currency:"INR",status:"checked_in",source:"Airbnb" },
//   { id:"BK1027",guestName:"Carlos Tanaka",roomNumber:"103",roomType:"Standard",checkIn:"2026-01-15",checkOut:"2026-01-18",guests:1,totalAmount:13500,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1028",guestName:"Mei Rodriguez",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-01-16",checkOut:"2026-01-20",guests:4,totalAmount:30000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1029",guestName:"Carlos Wang",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-01-18",checkOut:"2026-01-19",guests:4,totalAmount:7500,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1030",guestName:"Karan Kumar",roomNumber:"101",roomType:"Standard",checkIn:"2026-01-20",checkOut:"2026-01-22",guests:3,totalAmount:9000,currency:"INR",status:"checked_in",source:"Direct" },
//   { id:"BK1031",guestName:"Omar Shah",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-01-20",checkOut:"2026-01-30",guests:4,totalAmount:75000,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1032",guestName:"Valentina Reddy",roomNumber:"302",roomType:"Suite",checkIn:"2026-01-20",checkOut:"2026-01-24",guests:2,totalAmount:48000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1033",guestName:"Meera Sharma",roomNumber:"301",roomType:"Suite",checkIn:"2026-01-21",checkOut:"2026-01-24",guests:2,totalAmount:36000,currency:"INR",status:"cancelled",source:"Booking.com" },
//   { id:"BK1034",guestName:"Rohan Sato",roomNumber:"101",roomType:"Standard",checkIn:"2026-01-23",checkOut:"2026-01-25",guests:2,totalAmount:9000,currency:"INR",status:"checked_out",source:"Agoda" },
//   { id:"BK1035",guestName:"Olivia Sharma",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-01-23",checkOut:"2026-01-25",guests:2,totalAmount:15000,currency:"INR",status:"checked_out",source:"Booking.com" },
//   { id:"BK1036",guestName:"Sophia Garcia",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-01-23",checkOut:"2026-01-30",guests:1,totalAmount:154000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1037",guestName:"Ishita Joshi",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-01-24",checkOut:"2026-01-27",guests:4,totalAmount:66000,currency:"INR",status:"cancelled",source:"Airbnb" },
//   { id:"BK1038",guestName:"Liam Rossi",roomNumber:"101",roomType:"Standard",checkIn:"2026-01-25",checkOut:"2026-02-01",guests:1,totalAmount:31500,currency:"INR",status:"cancelled",source:"Airbnb" },
//   { id:"BK1039",guestName:"Arjun Lee",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-01-25",checkOut:"2026-02-08",guests:2,totalAmount:105000,currency:"INR",status:"checked_out",source:"Direct" },
//   { id:"BK1040",guestName:"Mei Williams",roomNumber:"102",roomType:"Standard",checkIn:"2026-01-26",checkOut:"2026-01-30",guests:2,totalAmount:18000,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1041",guestName:"Mason Kumar",roomNumber:"301",roomType:"Suite",checkIn:"2026-01-26",checkOut:"2026-01-28",guests:1,totalAmount:24000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1042",guestName:"Charlotte Dubois",roomNumber:"302",roomType:"Suite",checkIn:"2026-01-26",checkOut:"2026-01-29",guests:2,totalAmount:36000,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1043",guestName:"Charlotte Mehta",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-01-27",checkOut:"2026-01-31",guests:1,totalAmount:30000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1044",guestName:"Sofia Joshi",roomNumber:"103",roomType:"Standard",checkIn:"2026-01-28",checkOut:"2026-02-02",guests:2,totalAmount:22500,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1045",guestName:"Hiroshi Iyer",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-01-28",checkOut:"2026-01-31",guests:2,totalAmount:66000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1046",guestName:"Yuki Silva",roomNumber:"301",roomType:"Suite",checkIn:"2026-01-29",checkOut:"2026-01-31",guests:3,totalAmount:24000,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1047",guestName:"Aditya Martinez",roomNumber:"102",roomType:"Standard",checkIn:"2026-01-30",checkOut:"2026-02-01",guests:2,totalAmount:9000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1048",guestName:"Valentina Joshi",roomNumber:"302",roomType:"Suite",checkIn:"2026-01-30",checkOut:"2026-01-31",guests:4,totalAmount:12000,currency:"INR",status:"checked_in",source:"Walk-in" },
//   { id:"BK1049",guestName:"Lucas Müller",roomNumber:"302",roomType:"Suite",checkIn:"2026-01-31",checkOut:"2026-02-05",guests:1,totalAmount:60000,currency:"INR",status:"checked_out",source:"Direct" },
//   { id:"BK1050",guestName:"Charlotte Kumar",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-01-31",checkOut:"2026-02-02",guests:1,totalAmount:44000,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1051",guestName:"Rohan Müller",roomNumber:"102",roomType:"Standard",checkIn:"2026-02-01",checkOut:"2026-02-05",guests:2,totalAmount:18000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1052",guestName:"Lucas Nair",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-02-01",checkOut:"2026-02-03",guests:2,totalAmount:15000,currency:"INR",status:"checked_in",source:"Airbnb" },
//   { id:"BK1053",guestName:"Diya Nair",roomNumber:"103",roomType:"Standard",checkIn:"2026-02-02",checkOut:"2026-02-09",guests:3,totalAmount:31500,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1054",guestName:"Hiroshi Iyer",roomNumber:"301",roomType:"Suite",checkIn:"2026-02-02",checkOut:"2026-02-05",guests:2,totalAmount:36000,currency:"INR",status:"checked_out",source:"Agoda" },
//   { id:"BK1055",guestName:"Aditya Ahmed",roomNumber:"101",roomType:"Standard",checkIn:"2026-02-03",checkOut:"2026-02-07",guests:1,totalAmount:18000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1056",guestName:"Mateo Iyer",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-02-03",checkOut:"2026-02-06",guests:3,totalAmount:66000,currency:"INR",status:"checked_in",source:"Agoda" },
//   { id:"BK1057",guestName:"Noah Smith",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-02-04",checkOut:"2026-02-07",guests:2,totalAmount:22500,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1058",guestName:"Ava Iyer",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-02-04",checkOut:"2026-02-18",guests:1,totalAmount:308000,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1059",guestName:"Arjun Müller",roomNumber:"301",roomType:"Suite",checkIn:"2026-02-05",checkOut:"2026-02-07",guests:2,totalAmount:24000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1060",guestName:"Liam Sharma",roomNumber:"302",roomType:"Suite",checkIn:"2026-02-05",checkOut:"2026-02-08",guests:2,totalAmount:36000,currency:"INR",status:"checked_in",source:"Airbnb" },
//   { id:"BK1061",guestName:"Carlos Reddy",roomNumber:"102",roomType:"Standard",checkIn:"2026-02-06",checkOut:"2026-02-08",guests:2,totalAmount:9000,currency:"INR",status:"cancelled",source:"Agoda" },
//   { id:"BK1062",guestName:"Ishita Verma",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-02-06",checkOut:"2026-02-09",guests:3,totalAmount:22500,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1063",guestName:"Kavya Rodriguez",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-02-07",checkOut:"2026-02-10",guests:4,totalAmount:22500,currency:"INR",status:"cancelled",source:"Airbnb" },
//   { id:"BK1064",guestName:"Ishita Silva",roomNumber:"302",roomType:"Suite",checkIn:"2026-02-08",checkOut:"2026-02-15",guests:3,totalAmount:84000,currency:"INR",status:"cancelled",source:"Walk-in" },
//   { id:"BK1065",guestName:"Siddharth Singh",roomNumber:"102",roomType:"Standard",checkIn:"2026-02-09",checkOut:"2026-02-14",guests:3,totalAmount:22500,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1066",guestName:"James Davis",roomNumber:"103",roomType:"Standard",checkIn:"2026-02-09",checkOut:"2026-02-11",guests:2,totalAmount:9000,currency:"INR",status:"checked_out",source:"Airbnb" },
//   { id:"BK1067",guestName:"Priya Iyer",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-02-09",checkOut:"2026-02-19",guests:1,totalAmount:75000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1068",guestName:"Charlotte Lee",roomNumber:"101",roomType:"Standard",checkIn:"2026-02-10",checkOut:"2026-02-17",guests:2,totalAmount:31500,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1069",guestName:"Wei Nair",roomNumber:"301",roomType:"Suite",checkIn:"2026-02-10",checkOut:"2026-02-17",guests:2,totalAmount:84000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1070",guestName:"Nisha Johnson",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-02-11",checkOut:"2026-02-16",guests:2,totalAmount:37500,currency:"INR",status:"cancelled",source:"Agoda" },
//   { id:"BK1071",guestName:"Logan Shah",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-02-11",checkOut:"2026-02-14",guests:2,totalAmount:22500,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1072",guestName:"Vikram Smith",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-02-14",checkOut:"2026-02-21",guests:1,totalAmount:52500,currency:"INR",status:"checked_out",source:"Direct" },
//   { id:"BK1073",guestName:"Ishita Wang",roomNumber:"102",roomType:"Standard",checkIn:"2026-02-15",checkOut:"2026-02-18",guests:2,totalAmount:13500,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1074",guestName:"Mia Rossi",roomNumber:"103",roomType:"Standard",checkIn:"2026-02-16",checkOut:"2026-02-21",guests:1,totalAmount:22500,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1075",guestName:"Aditya Rodriguez",roomNumber:"302",roomType:"Suite",checkIn:"2026-02-16",checkOut:"2026-02-23",guests:2,totalAmount:84000,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1076",guestName:"Sofia Sharma",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-02-16",checkOut:"2026-02-21",guests:2,totalAmount:110000,currency:"INR",status:"cancelled",source:"Walk-in" },
//   { id:"BK1077",guestName:"Vikram Rodriguez",roomNumber:"101",roomType:"Standard",checkIn:"2026-02-18",checkOut:"2026-02-20",guests:2,totalAmount:9000,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1078",guestName:"Nisha Davis",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-02-18",checkOut:"2026-02-21",guests:2,totalAmount:22500,currency:"INR",status:"checked_out",source:"Walk-in" },
//   { id:"BK1079",guestName:"Valentina Gupta",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-02-18",checkOut:"2026-02-23",guests:2,totalAmount:110000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1080",guestName:"Pooja Gupta",roomNumber:"102",roomType:"Standard",checkIn:"2026-02-19",checkOut:"2026-02-21",guests:3,totalAmount:9000,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1081",guestName:"Yuki Müller",roomNumber:"301",roomType:"Suite",checkIn:"2026-02-19",checkOut:"2026-02-24",guests:2,totalAmount:60000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1082",guestName:"James Mehta",roomNumber:"103",roomType:"Standard",checkIn:"2026-02-21",checkOut:"2026-02-26",guests:2,totalAmount:22500,currency:"INR",status:"checked_out",source:"Agoda" },
//   { id:"BK1083",guestName:"Omar Shah",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-02-21",checkOut:"2026-02-22",guests:2,totalAmount:7500,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1084",guestName:"Meera Martinez",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-02-21",checkOut:"2026-02-23",guests:2,totalAmount:15000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1085",guestName:"Sofia Iyer",roomNumber:"101",roomType:"Standard",checkIn:"2026-02-22",checkOut:"2026-02-24",guests:2,totalAmount:9000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1086",guestName:"Pooja Müller",roomNumber:"102",roomType:"Standard",checkIn:"2026-02-22",checkOut:"2026-02-25",guests:2,totalAmount:13500,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1087",guestName:"Mateo Joshi",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-02-23",checkOut:"2026-02-27",guests:1,totalAmount:30000,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1088",guestName:"Emma Kumar",roomNumber:"101",roomType:"Standard",checkIn:"2026-02-24",checkOut:"2026-02-25",guests:2,totalAmount:4500,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1089",guestName:"Priya Patel",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-02-24",checkOut:"2026-02-26",guests:1,totalAmount:15000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1090",guestName:"Olivia Silva",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-02-24",checkOut:"2026-02-26",guests:1,totalAmount:44000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1091",guestName:"Aisha Sato",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-02-25",checkOut:"2026-03-02",guests:1,totalAmount:37500,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1092",guestName:"Carlos Smith",roomNumber:"301",roomType:"Suite",checkIn:"2026-02-25",checkOut:"2026-02-27",guests:2,totalAmount:24000,currency:"INR",status:"checked_out",source:"Airbnb" },
//   { id:"BK1093",guestName:"Arjun Lee",roomNumber:"302",roomType:"Suite",checkIn:"2026-02-25",checkOut:"2026-03-01",guests:2,totalAmount:48000,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1094",guestName:"Emma Müller",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-02-26",checkOut:"2026-03-03",guests:2,totalAmount:110000,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1095",guestName:"Isabella Kumar",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-02-26",checkOut:"2026-03-05",guests:2,totalAmount:154000,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1096",guestName:"Omar Iyer",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-02-27",checkOut:"2026-03-04",guests:2,totalAmount:37500,currency:"INR",status:"checked_out",source:"Expedia" },
//   { id:"BK1097",guestName:"Isabella Dubois",roomNumber:"101",roomType:"Standard",checkIn:"2026-02-28",checkOut:"2026-03-02",guests:2,totalAmount:9000,currency:"INR",status:"checked_out",source:"Booking.com" },
//   { id:"BK1098",guestName:"Carlos Rossi",roomNumber:"102",roomType:"Standard",checkIn:"2026-02-28",checkOut:"2026-03-07",guests:1,totalAmount:31500,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1099",guestName:"Diya Garcia",roomNumber:"103",roomType:"Standard",checkIn:"2026-02-28",checkOut:"2026-03-03",guests:1,totalAmount:13500,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1100",guestName:"Mateo Gupta",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-02-28",checkOut:"2026-03-05",guests:2,totalAmount:37500,currency:"INR",status:"checked_in",source:"Expedia" },
//   { id:"BK1101",guestName:"James Sato",roomNumber:"101",roomType:"Standard",checkIn:"2026-03-02",checkOut:"2026-03-04",guests:2,totalAmount:9000,currency:"INR",status:"cancelled",source:"Expedia" },
//   { id:"BK1102",guestName:"Lucas Iyer",roomNumber:"301",roomType:"Suite",checkIn:"2026-03-02",checkOut:"2026-03-16",guests:2,totalAmount:168000,currency:"INR",status:"checked_in",source:"Direct" },
//   { id:"BK1103",guestName:"Valentina Verma",roomNumber:"302",roomType:"Suite",checkIn:"2026-03-03",checkOut:"2026-03-05",guests:2,totalAmount:24000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1104",guestName:"Priya Reddy",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-03-04",checkOut:"2026-03-09",guests:1,totalAmount:110000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1105",guestName:"Olivia Verma",roomNumber:"103",roomType:"Standard",checkIn:"2026-03-05",checkOut:"2026-03-07",guests:1,totalAmount:9000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1106",guestName:"Mia Joshi",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-03-05",checkOut:"2026-03-08",guests:3,totalAmount:22500,currency:"INR",status:"cancelled",source:"Agoda" },
//   { id:"BK1107",guestName:"Karan Ahmed",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-03-06",checkOut:"2026-03-08",guests:2,totalAmount:15000,currency:"INR",status:"checked_in",source:"Booking.com" },
//   { id:"BK1108",guestName:"Arjun Davis",roomNumber:"101",roomType:"Standard",checkIn:"2026-03-07",checkOut:"2026-03-10",guests:2,totalAmount:13500,currency:"INR",status:"checked_out",source:"Direct" },
//   { id:"BK1109",guestName:"Sofia Dubois",roomNumber:"103",roomType:"Standard",checkIn:"2026-03-07",checkOut:"2026-03-09",guests:1,totalAmount:9000,currency:"INR",status:"checked_in",source:"Agoda" },
//   { id:"BK1110",guestName:"Olivia Martinez",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-03-07",checkOut:"2026-03-09",guests:1,totalAmount:15000,currency:"INR",status:"checked_in",source:"Expedia" },
//   { id:"BK1111",guestName:"Nisha Smith",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-03-07",checkOut:"2026-03-08",guests:3,totalAmount:22000,currency:"INR",status:"checked_in",source:"Expedia" },
//   { id:"BK1112",guestName:"Ishita Garcia",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-03-08",checkOut:"2026-03-18",guests:2,totalAmount:75000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1113",guestName:"Nisha Lee",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-03-08",checkOut:"2026-03-18",guests:1,totalAmount:75000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1114",guestName:"Mateo Rodriguez",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-03-09",checkOut:"2026-03-12",guests:3,totalAmount:66000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1115",guestName:"Siddharth Reddy",roomNumber:"302",roomType:"Suite",checkIn:"2026-03-10",checkOut:"2026-03-12",guests:2,totalAmount:24000,currency:"INR",status:"checked_out",source:"Airbnb" },
//   { id:"BK1116",guestName:"Rahul Khan",roomNumber:"103",roomType:"Standard",checkIn:"2026-03-11",checkOut:"2026-03-18",guests:2,totalAmount:31500,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1117",guestName:"Yuki Brown",roomNumber:"102",roomType:"Standard",checkIn:"2026-03-12",checkOut:"2026-03-17",guests:1,totalAmount:22500,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1118",guestName:"Kavya Nair",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-03-12",checkOut:"2026-03-14",guests:2,totalAmount:44000,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1119",guestName:"Ananya Nair",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-03-12",checkOut:"2026-03-17",guests:1,totalAmount:110000,currency:"INR",status:"checked_out",source:"Walk-in" },
//   { id:"BK1120",guestName:"Rahul Khan",roomNumber:"101",roomType:"Standard",checkIn:"2026-03-13",checkOut:"2026-03-20",guests:1,totalAmount:31500,currency:"INR",status:"checked_in",source:"Agoda" },
//   { id:"BK1121",guestName:"James Silva",roomNumber:"302",roomType:"Suite",checkIn:"2026-03-13",checkOut:"2026-03-20",guests:3,totalAmount:84000,currency:"INR",status:"checked_out",source:"Airbnb" },
//   { id:"BK1122",guestName:"Pooja Singh",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-03-14",checkOut:"2026-03-16",guests:2,totalAmount:15000,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1123",guestName:"Hiroshi Williams",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-03-16",checkOut:"2026-03-19",guests:3,totalAmount:66000,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1124",guestName:"Lucas Smith",roomNumber:"301",roomType:"Suite",checkIn:"2026-03-17",checkOut:"2026-03-20",guests:4,totalAmount:36000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1125",guestName:"Mason Khan",roomNumber:"103",roomType:"Standard",checkIn:"2026-03-18",checkOut:"2026-03-22",guests:2,totalAmount:18000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1126",guestName:"Rohan Verma",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-03-18",checkOut:"2026-03-20",guests:4,totalAmount:15000,currency:"INR",status:"checked_out",source:"Expedia" },
//   { id:"BK1127",guestName:"Nisha Ahmed",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-03-18",checkOut:"2026-03-22",guests:2,totalAmount:88000,currency:"INR",status:"checked_out",source:"Direct" },
//   { id:"BK1128",guestName:"Sofia Rodriguez",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-03-19",checkOut:"2026-03-24",guests:2,totalAmount:37500,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1129",guestName:"Mei Nair",roomNumber:"101",roomType:"Standard",checkIn:"2026-03-20",checkOut:"2026-03-23",guests:4,totalAmount:13500,currency:"INR",status:"checked_out",source:"Direct" },
//   { id:"BK1130",guestName:"Vikram Mehta",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-03-20",checkOut:"2026-03-22",guests:1,totalAmount:15000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1131",guestName:"Omar Patel",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-03-21",checkOut:"2026-03-24",guests:2,totalAmount:66000,currency:"INR",status:"checked_out",source:"Airbnb" },
//   { id:"BK1132",guestName:"Lucas Nair",roomNumber:"102",roomType:"Standard",checkIn:"2026-03-22",checkOut:"2026-03-24",guests:1,totalAmount:9000,currency:"INR",status:"checked_out",source:"Airbnb" },
//   { id:"BK1133",guestName:"Rohan Müller",roomNumber:"103",roomType:"Standard",checkIn:"2026-03-22",checkOut:"2026-03-26",guests:2,totalAmount:18000,currency:"INR",status:"checked_out",source:"Booking.com" },
//   { id:"BK1134",guestName:"Aarav Müller",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-03-22",checkOut:"2026-03-23",guests:2,totalAmount:7500,currency:"INR",status:"checked_in",source:"Expedia" },
//   { id:"BK1135",guestName:"Vikram Reddy",roomNumber:"302",roomType:"Suite",checkIn:"2026-03-22",checkOut:"2026-03-24",guests:1,totalAmount:24000,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1136",guestName:"Charlotte Tanaka",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-03-23",checkOut:"2026-04-02",guests:2,totalAmount:75000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1137",guestName:"Aditya Joshi",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-03-23",checkOut:"2026-03-26",guests:2,totalAmount:22500,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1138",guestName:"Valentina Brown",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-03-23",checkOut:"2026-03-25",guests:2,totalAmount:44000,currency:"INR",status:"checked_out",source:"Walk-in" },
//   { id:"BK1139",guestName:"Emma Ahmed",roomNumber:"101",roomType:"Standard",checkIn:"2026-03-25",checkOut:"2026-03-27",guests:3,totalAmount:9000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1140",guestName:"Sofia Wang",roomNumber:"102",roomType:"Standard",checkIn:"2026-03-25",checkOut:"2026-04-04",guests:4,totalAmount:45000,currency:"INR",status:"checked_out",source:"Booking.com" },
//   { id:"BK1141",guestName:"Ava Müller",roomNumber:"301",roomType:"Suite",checkIn:"2026-03-25",checkOut:"2026-03-27",guests:4,totalAmount:24000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1142",guestName:"Hiroshi Müller",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-03-25",checkOut:"2026-04-04",guests:1,totalAmount:220000,currency:"INR",status:"checked_in",source:"Expedia" },
//   { id:"BK1143",guestName:"Aditya Iyer",roomNumber:"103",roomType:"Standard",checkIn:"2026-03-26",checkOut:"2026-04-02",guests:2,totalAmount:31500,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1144",guestName:"Sofia Williams",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-03-26",checkOut:"2026-03-30",guests:2,totalAmount:30000,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1145",guestName:"Sofia Verma",roomNumber:"302",roomType:"Suite",checkIn:"2026-03-26",checkOut:"2026-04-09",guests:4,totalAmount:168000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1146",guestName:"Ishita Sharma",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-03-26",checkOut:"2026-03-28",guests:4,totalAmount:44000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1147",guestName:"James Davis",roomNumber:"101",roomType:"Standard",checkIn:"2026-03-27",checkOut:"2026-03-29",guests:1,totalAmount:9000,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1148",guestName:"Diya Johnson",roomNumber:"301",roomType:"Suite",checkIn:"2026-03-27",checkOut:"2026-04-03",guests:1,totalAmount:84000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1149",guestName:"James Khan",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-03-29",checkOut:"2026-03-30",guests:2,totalAmount:7500,currency:"INR",status:"cancelled",source:"Walk-in" },
//   { id:"BK1150",guestName:"Emma Verma",roomNumber:"103",roomType:"Standard",checkIn:"2026-04-02",checkOut:"2026-04-04",guests:3,totalAmount:9000,currency:"INR",status:"checked_out",source:"Expedia" },
//   { id:"BK1151",guestName:"Emma Ahmed",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-04-02",checkOut:"2026-04-05",guests:3,totalAmount:22500,currency:"INR",status:"checked_out",source:"Expedia" },
//   { id:"BK1152",guestName:"Omar Khan",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-04-02",checkOut:"2026-04-05",guests:2,totalAmount:22500,currency:"INR",status:"checked_out",source:"Expedia" },
//   { id:"BK1153",guestName:"Aditya Lee",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-04-02",checkOut:"2026-04-04",guests:1,totalAmount:15000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1154",guestName:"Liam Shah",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-04-02",checkOut:"2026-04-07",guests:3,totalAmount:110000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1155",guestName:"Wei Rodriguez",roomNumber:"101",roomType:"Standard",checkIn:"2026-04-03",checkOut:"2026-04-10",guests:2,totalAmount:31500,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1156",guestName:"Carlos Patel",roomNumber:"102",roomType:"Standard",checkIn:"2026-04-04",checkOut:"2026-04-06",guests:1,totalAmount:9000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1157",guestName:"Isabella Lee",roomNumber:"301",roomType:"Suite",checkIn:"2026-04-04",checkOut:"2026-04-14",guests:2,totalAmount:120000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1158",guestName:"Mei Mehta",roomNumber:"102",roomType:"Standard",checkIn:"2026-04-06",checkOut:"2026-04-09",guests:4,totalAmount:13500,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1159",guestName:"Priya Singh",roomNumber:"103",roomType:"Standard",checkIn:"2026-04-06",checkOut:"2026-04-11",guests:2,totalAmount:22500,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1160",guestName:"Noah Müller",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-04-06",checkOut:"2026-04-11",guests:2,totalAmount:37500,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1161",guestName:"Vikram Dubois",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-04-06",checkOut:"2026-04-09",guests:4,totalAmount:66000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1162",guestName:"Liam Iyer",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-04-07",checkOut:"2026-04-09",guests:1,totalAmount:15000,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1163",guestName:"Olivia Rodriguez",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-04-07",checkOut:"2026-04-08",guests:1,totalAmount:7500,currency:"INR",status:"cancelled",source:"Airbnb" },
//   { id:"BK1164",guestName:"Carlos Tanaka",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-04-08",checkOut:"2026-04-11",guests:1,totalAmount:66000,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1165",guestName:"Pooja Smith",roomNumber:"102",roomType:"Standard",checkIn:"2026-04-09",checkOut:"2026-04-11",guests:2,totalAmount:9000,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1166",guestName:"Isabella Nair",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-04-09",checkOut:"2026-04-12",guests:2,totalAmount:22500,currency:"INR",status:"checked_out",source:"Agoda" },
//   { id:"BK1167",guestName:"James Martinez",roomNumber:"302",roomType:"Suite",checkIn:"2026-04-09",checkOut:"2026-04-12",guests:2,totalAmount:36000,currency:"INR",status:"checked_in",source:"Walk-in" },
//   { id:"BK1168",guestName:"Aditya Smith",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-04-10",checkOut:"2026-04-13",guests:1,totalAmount:22500,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1169",guestName:"Mei Silva",roomNumber:"101",roomType:"Standard",checkIn:"2026-04-11",checkOut:"2026-04-13",guests:4,totalAmount:9000,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1170",guestName:"Mason Wang",roomNumber:"102",roomType:"Standard",checkIn:"2026-04-11",checkOut:"2026-04-14",guests:2,totalAmount:13500,currency:"INR",status:"cancelled",source:"Agoda" },
//   { id:"BK1171",guestName:"Mateo Rodriguez",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-04-11",checkOut:"2026-04-14",guests:3,totalAmount:22500,currency:"INR",status:"checked_in",source:"Airbnb" },
//   { id:"BK1172",guestName:"Valentina Garcia",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-04-11",checkOut:"2026-04-12",guests:2,totalAmount:22000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1173",guestName:"Aisha Johnson",roomNumber:"103",roomType:"Standard",checkIn:"2026-04-13",checkOut:"2026-04-27",guests:1,totalAmount:63000,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1174",guestName:"Charlotte Johnson",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-04-13",checkOut:"2026-04-16",guests:2,totalAmount:22500,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1175",guestName:"Mia Sato",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-04-13",checkOut:"2026-04-14",guests:1,totalAmount:7500,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1176",guestName:"Isabella Müller",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-04-13",checkOut:"2026-04-17",guests:2,totalAmount:88000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1177",guestName:"Olivia Iyer",roomNumber:"101",roomType:"Standard",checkIn:"2026-04-14",checkOut:"2026-04-15",guests:4,totalAmount:4500,currency:"INR",status:"confirmed",source:"Booking.com" },
//   { id:"BK1178",guestName:"Nisha Verma",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-04-14",checkOut:"2026-04-21",guests:1,totalAmount:52500,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1179",guestName:"Mateo Martinez",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-04-14",checkOut:"2026-04-15",guests:4,totalAmount:7500,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1180",guestName:"Noah Iyer",roomNumber:"102",roomType:"Standard",checkIn:"2026-04-15",checkOut:"2026-04-25",guests:2,totalAmount:45000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1181",guestName:"Noah Lee",roomNumber:"301",roomType:"Suite",checkIn:"2026-04-17",checkOut:"2026-04-24",guests:2,totalAmount:84000,currency:"INR",status:"checked_out",source:"Agoda" },
//   { id:"BK1182",guestName:"Priya Rodriguez",roomNumber:"302",roomType:"Suite",checkIn:"2026-04-17",checkOut:"2026-04-19",guests:2,totalAmount:24000,currency:"INR",status:"checked_out",source:"Airbnb" },
//   { id:"BK1183",guestName:"Mateo Johnson",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-04-17",checkOut:"2026-04-24",guests:3,totalAmount:154000,currency:"INR",status:"cancelled",source:"Expedia" },
//   { id:"BK1184",guestName:"Yuki Rossi",roomNumber:"101",roomType:"Standard",checkIn:"2026-04-18",checkOut:"2026-04-28",guests:1,totalAmount:45000,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1185",guestName:"Kavya Brown",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-04-18",checkOut:"2026-04-21",guests:3,totalAmount:22500,currency:"INR",status:"checked_out",source:"Walk-in" },
//   { id:"BK1186",guestName:"Priya Müller",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-04-19",checkOut:"2026-04-22",guests:3,totalAmount:22500,currency:"INR",status:"cancelled",source:"Expedia" },
//   { id:"BK1187",guestName:"Sofia Sharma",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-04-21",checkOut:"2026-04-24",guests:3,totalAmount:22500,currency:"INR",status:"checked_out",source:"Booking.com" },
//   { id:"BK1188",guestName:"Mia Lee",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-04-22",checkOut:"2026-04-24",guests:4,totalAmount:15000,currency:"INR",status:"checked_out",source:"Direct" },
//   { id:"BK1189",guestName:"Aisha Johnson",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-04-22",checkOut:"2026-04-25",guests:2,totalAmount:66000,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1190",guestName:"Lucas Müller",roomNumber:"201",roomType:"Deluxe",checkIn:"2026-04-23",checkOut:"2026-05-03",guests:2,totalAmount:75000,currency:"INR",status:"checked_in",source:"Agoda" },
//   { id:"BK1191",guestName:"Pooja Tanaka",roomNumber:"202",roomType:"Deluxe",checkIn:"2026-04-24",checkOut:"2026-04-28",guests:2,totalAmount:30000,currency:"INR",status:"checked_out",source:"Walk-in" },
//   { id:"BK1192",guestName:"Liam Iyer",roomNumber:"301",roomType:"Suite",checkIn:"2026-04-24",checkOut:"2026-04-25",guests:2,totalAmount:12000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1193",guestName:"Charlotte Silva",roomNumber:"302",roomType:"Suite",checkIn:"2026-04-24",checkOut:"2026-04-26",guests:1,totalAmount:24000,currency:"INR",status:"confirmed",source:"Walk-in" },
//   { id:"BK1194",guestName:"Vikram Sharma",roomNumber:"102",roomType:"Standard",checkIn:"2026-04-25",checkOut:"2026-04-29",guests:2,totalAmount:18000,currency:"INR",status:"checked_out",source:"Agoda" },
//   { id:"BK1195",guestName:"Karan Müller",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-04-25",checkOut:"2026-04-28",guests:2,totalAmount:22500,currency:"INR",status:"confirmed",source:"Airbnb" },
//   { id:"BK1196",guestName:"Sofia Sato",roomNumber:"401",roomType:"Penthouse",checkIn:"2026-04-25",checkOut:"2026-04-29",guests:3,totalAmount:88000,currency:"INR",status:"confirmed",source:"Expedia" },
//   { id:"BK1197",guestName:"Priya Shah",roomNumber:"402",roomType:"Penthouse",checkIn:"2026-04-26",checkOut:"2026-04-29",guests:1,totalAmount:66000,currency:"INR",status:"confirmed",source:"Agoda" },
//   { id:"BK1198",guestName:"Olivia Brown",roomNumber:"302",roomType:"Suite",checkIn:"2026-04-27",checkOut:"2026-04-29",guests:4,totalAmount:24000,currency:"INR",status:"confirmed",source:"Direct" },
//   { id:"BK1199",guestName:"Isabella Rossi",roomNumber:"203",roomType:"Deluxe",checkIn:"2026-04-29",checkOut:"2026-05-02",guests:2,totalAmount:22500,currency:"INR",status:"checked_out",source:"Direct" },
//   { id:"BK1200",guestName:"Sophia Wang",roomNumber:"302",roomType:"Suite",checkIn:"2026-04-29",checkOut:"2026-05-02",guests:2,totalAmount:36000,currency:"INR",status:"checked_out",source:"Expedia" },
// ];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const TOTAL_ROOMS = 10;
const STATUS_CONFIG = {
  confirmed:   { label: "Confirmed",   color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  checked_in:  { label: "Checked In",  color: "bg-blue-100 text-blue-800 border-blue-200" },
  checked_out: { label: "Checked Out", color: "bg-slate-100 text-slate-700 border-slate-200" },
  cancelled:   { label: "Cancelled",   color: "bg-red-100 text-red-700 border-red-200" },
};

// ─── DATE UTILITIES ───────────────────────────────────────────────────────────
const toDateStr = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const parseDate = (str) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const diffDays = (a, b) => Math.round((b - a) / 86400000);
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const bookingOccupiesNight = (booking, dateStr) => {
  if (booking.status === "cancelled") return false;
  return booking.checkIn <= dateStr && dateStr < booking.checkOut;
};

const bookingOverlapsRange = (booking, startStr, endStr) => {
  if (booking.status === "cancelled") return false;
  const rangeEnd = toDateStr(addDays(parseDate(endStr), 1));
  return booking.checkIn < rangeEnd && booking.checkOut > startStr;
};

// ─── HEATMAP COLOR ────────────────────────────────────────────────────────────
const getHeatColor = (count, isCurrentMonth = true) => {
  if (count === 0) return isCurrentMonth ? "bg-slate-50" : "bg-slate-50/40";
  const pct = count / TOTAL_ROOMS;
  if (pct <= 0.2) return isCurrentMonth ? "bg-amber-100" : "bg-amber-100/40";
  if (pct <= 0.4) return isCurrentMonth ? "bg-amber-200" : "bg-amber-200/40";
  if (pct <= 0.6) return isCurrentMonth ? "bg-orange-300" : "bg-orange-300/40";
  if (pct <= 0.8) return isCurrentMonth ? "bg-orange-400" : "bg-orange-400/40";
  return isCurrentMonth ? "bg-rose-500" : "bg-rose-500/40";
};
const getHeatTextColor = (count) => {
  if (count === 0) return "text-slate-400";
  const pct = count / TOTAL_ROOMS;
  if (pct <= 0.4) return "text-amber-900";
  if (pct <= 0.6) return "text-orange-900";
  return "text-white";
};

// ─── MINI OCCUPANCY BAR ───────────────────────────────────────────────────────
const OccupancyBar = ({ count }) => {
  const pct = Math.round((count / TOTAL_ROOMS) * 100);
  const color = count === 0 ? "bg-slate-200" : pct <= 40 ? "bg-amber-400" : pct <= 70 ? "bg-orange-400" : "bg-rose-500";
  return (
    <div className="w-full h-1 rounded-full bg-slate-200 mt-1">
      <div className={`h-1 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
};

// ─── TOOLTIP ──────────────────────────────────────────────────────────────────
const Tooltip = ({ dateStr, bookings, position }) => {
  const dayBookings = bookings.filter(b => bookingOccupiesNight(b, dateStr));
  const cancelled = bookings.filter(b => b.status === "cancelled" && b.checkIn <= dateStr && dateStr < b.checkOut);
  if (!position) return null;
  return (
    <div
      className="fixed z-50 bg-slate-900 text-white text-xs rounded-xl shadow-2xl p-3 w-56 pointer-events-none"
      style={{ top: position.y, left: position.x, transform: "translate(-50%, -110%)" }}
    >
      <p className="font-semibold text-slate-200 mb-1.5">
        {new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
      </p>
      <p className="text-slate-300 mb-1">{dayBookings.length}/{TOTAL_ROOMS} rooms occupied</p>
      {dayBookings.length > 0 && (
        <div className="space-y-1 mt-2 border-t border-slate-700 pt-2">
          {dayBookings.slice(0, 4).map(b => (
            <div key={b.id} className="flex justify-between items-center">
              <span className="text-slate-300 truncate flex-1 mr-2">{b.guestName}</span>
              <span className="text-slate-400 shrink-0">Rm {b.roomNumber}</span>
            </div>
          ))}
          {dayBookings.length > 4 && <p className="text-slate-500">+{dayBookings.length - 4} more</p>}
        </div>
      )}
      {cancelled.length > 0 && <p className="text-slate-500 mt-1 text-[11px]">{cancelled.length} cancelled</p>}
    </div>
  );
};

// ─── DAY CELL ─────────────────────────────────────────────────────────────────
const DayCell = ({
  dateStr, dayNum, isCurrentMonth, occupancy, isToday,
  isSelected, isInRange, onMouseDown, onMouseEnter, onMouseUp, onClick,
  bookings, showTooltip, isDragging,
}) => {
  const [tooltipPos, setTooltipPos] = useState(null);

  const handleMouseEnterCell = (e) => {
    onMouseEnter(dateStr);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
  };

  const heatBg = getHeatColor(occupancy, isCurrentMonth);
  const heatText = getHeatTextColor(occupancy);
  let borderClass = "border border-slate-200/60";
  let ringClass = "";
  if (isSelected || isInRange) { borderClass = "border border-indigo-400"; ringClass = "ring-1 ring-inset ring-indigo-300"; }
  if (isToday && isCurrentMonth) borderClass = "border-2 border-indigo-600";
  const bgOverlay = isInRange ? "bg-indigo-100/70" : isSelected ? "bg-indigo-200/80" : "";
  const dimClass = !isCurrentMonth ? "opacity-40" : "";

  return (
    <div
      className={`relative rounded-lg cursor-pointer select-none transition-all duration-150
        ${heatBg} ${borderClass} ${ringClass} ${dimClass}
        hover:scale-[1.03] hover:z-10 hover:shadow-md active:scale-95`}
      style={{ minHeight: "72px" }}
      onMouseDown={() => onMouseDown(dateStr)}
      onMouseEnter={handleMouseEnterCell}
      onMouseLeave={() => setTooltipPos(null)}
      onMouseUp={() => onMouseUp(dateStr)}
      onClick={() => onClick(dateStr)}
    >
      {(isInRange || isSelected) && (
        <div className={`absolute inset-0 rounded-lg ${bgOverlay} pointer-events-none z-0`} />
      )}
      <div className="relative z-10 p-1.5 sm:p-2 flex flex-col h-full">
        <div className="flex items-start justify-between">
          <span className={`text-xs sm:text-sm font-semibold leading-none ${isToday && isCurrentMonth ? "text-indigo-700" : heatText}`}>
            {dayNum}
          </span>
          {occupancy > 0 && (
            <span className={`text-[9px] sm:text-[10px] font-bold leading-none ${heatText} opacity-80`}>
              {occupancy}/{TOTAL_ROOMS}
            </span>
          )}
        </div>
        <div className="mt-auto"><OccupancyBar count={occupancy} /></div>
      </div>
      {showTooltip && !isDragging && tooltipPos && (
        <Tooltip dateStr={dateStr} bookings={bookings} position={tooltipPos} />
      )}
    </div>
  );
};

// ─── BOOKING CARD ─────────────────────────────────────────────────────────────
const BookingCard = ({ booking }) => {
  const nights = diffDays(parseDate(booking.checkIn), parseDate(booking.checkOut));
  const sc = STATUS_CONFIG[booking.status] || STATUS_CONFIG.confirmed;
  const fmt = (d) => parseDate(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const amtFmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(booking.totalAmount);
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate">{booking.guestName}</p>
          <p className="text-xs text-slate-500 mt-0.5">{booking.id} · {booking.source}</p>
        </div>
        <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.color}`}>{sc.label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-2">
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-0.5">Room</p>
          <p className="font-medium">{booking.roomNumber} <span className="text-slate-400">({booking.roomType})</span></p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-0.5">Nights</p>
          <p className="font-medium">{nights} night{nights !== 1 ? "s" : ""} · {booking.guests} guest{booking.guests !== 1 ? "s" : ""}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-0.5">Check-in</p>
          <p className="font-medium">{fmt(booking.checkIn)}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-0.5">Check-out</p>
          <p className="font-medium">{fmt(booking.checkOut)}</p>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">{booking.currency}</span>
        <span className="text-sm font-bold text-slate-800">{amtFmt}</span>
      </div>
    </div>
  );
};

// ─── STATS STRIP ──────────────────────────────────────────────────────────────
const StatsStrip = ({ bookings, year, month }) => {
  const monthBookings = useMemo(() => {
    const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const end = `${year}-${String(month + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;
    return bookings.filter(b => b.status !== "cancelled" && b.checkIn <= end && b.checkOut > start);
  }, [bookings, year, month]);

  const revenue = monthBookings.reduce((s, b) => s + b.totalAmount, 0);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let totalOccupancyNights = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    totalOccupancyNights += bookings.filter(b => bookingOccupiesNight(b, ds)).length;
  }
  const avgOcc = Math.round((totalOccupancyNights / (daysInMonth * TOTAL_ROOMS)) * 100);
  const longestStay = monthBookings.reduce((max, b) => { const n = diffDays(parseDate(b.checkIn), parseDate(b.checkOut)); return n > max ? n : max; }, 0);
  const roomCounts = {};
  monthBookings.forEach(b => { roomCounts[b.roomType] = (roomCounts[b.roomType] || 0) + 1; });
  const topRoom = Object.entries(roomCounts).sort((a, b) => b[1] - a[1])[0];
  const revFmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", notation: "compact", maximumFractionDigits: 1 }).format(revenue);

  const stats = [
    { label: "Monthly Revenue", value: revFmt, icon: "💰" },
    { label: "Avg Occupancy", value: `${avgOcc}%`, icon: "📊" },
    { label: "Longest Stay", value: `${longestStay}d`, icon: "📅" },
    { label: "Top Room Type", value: topRoom ? topRoom[0] : "—", icon: "🏨" },
    { label: "Total Bookings", value: monthBookings.length, icon: "📋" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 text-center">
          <p className="text-lg sm:text-xl">{s.icon}</p>
          <p className="text-lg sm:text-2xl font-bold text-slate-800 mt-0.5">{s.value}</p>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-tight">{s.label}</p>
        </div>
      ))}
    </div>
  );
};

// ─── HEATMAP LEGEND ───────────────────────────────────────────────────────────
const Legend = () => (
  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-500">
    <span>Low</span>
    {[0, 2, 4, 7, 9, 10].map(n => (
      <div key={n} className={`w-4 h-4 sm:w-5 sm:h-5 rounded ${getHeatColor(n)} border border-slate-200/60`} />
    ))}
    <span>High</span>
  </div>
);

// ─── FILTER BAR ───────────────────────────────────────────────────────────────
const FilterBar = ({ filters, onChange, onExport }) => {
  const roomTypes = ["All", "Standard", "Deluxe", "Suite", "Penthouse"];
  const sources = ["All", "Direct", "Airbnb", "Booking.com", "Expedia", "Agoda", "Walk-in"];
  const statuses = ["All", "confirmed", "checked_in", "checked_out", "cancelled"];
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Filters</span>
      {[["roomType", roomTypes], ["source", sources], ["status", statuses]].map(([key, opts]) => (
        <select key={key} value={filters[key]} onChange={e => onChange({ ...filters, [key]: e.target.value })}
          className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
          {opts.map(t => <option key={t}>{t}</option>)}
        </select>
      ))}
      {(filters.roomType !== "All" || filters.source !== "All" || filters.status !== "All") && (
        <button onClick={() => onChange({ roomType: "All", source: "All", status: "All" })}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
          Clear
        </button>
      )}
      <div className="ml-auto">
        <button onClick={onExport}
          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          Export CSV
        </button>
      </div>
    </div>
  );
};

// ─── SEARCH BAR ───────────────────────────────────────────────────────────────
const SearchBar = ({ value, onChange }) => (
  <div className="relative mb-4">
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input type="text" placeholder="Search guest name..." value={value} onChange={e => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-700 placeholder-slate-400" />
    {value && (
      <button onClick={() => onChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function BookingCalendar() {
  // Use embedded data directly — no fetch needed
  const bookings = BOOKINGS_DATA;

  const today = new Date();
  const todayStr = toDateStr(today);

  const savedState = (() => {
    try { const s = sessionStorage.getItem("guestara_last_view"); return s ? JSON.parse(s) : null; } catch { return null; }
  })();

  const [viewYear, setViewYear] = useState(savedState?.year ?? 2026);
  const [viewMonth, setViewMonth] = useState(savedState?.month ?? 0); // default Jan 2026 where data starts
  const [selStart, setSelStart] = useState(null);
  const [selEnd, setSelEnd] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);
  const [filters, setFilters] = useState({ roomType: "All", source: "All", status: "All" });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("calendar");

  useEffect(() => {
    try { sessionStorage.setItem("guestara_last_view", JSON.stringify({ year: viewYear, month: viewMonth })); } catch {}
  }, [viewYear, viewMonth]);

  const filteredBookings = useMemo(() => {
    let b = bookings;
    if (filters.roomType !== "All") b = b.filter(x => x.roomType === filters.roomType);
    if (filters.source !== "All") b = b.filter(x => x.source === filters.source);
    if (filters.status !== "All") b = b.filter(x => x.status === filters.status);
    return b;
  }, [bookings, filters]);

  const searchHighlightDates = useMemo(() => {
    if (!searchQuery.trim()) return new Set();
    const q = searchQuery.toLowerCase();
    const matching = bookings.filter(b => b.guestName.toLowerCase().includes(q));
    const dates = new Set();
    matching.forEach(b => {
      let cur = parseDate(b.checkIn);
      const out = parseDate(b.checkOut);
      while (cur < out) { dates.add(toDateStr(cur)); cur = addDays(cur, 1); }
    });
    return dates;
  }, [bookings, searchQuery]);

  const occupancyMap = useMemo(() => {
    const map = {};
    const startDate = addDays(new Date(viewYear, viewMonth, 1), -7);
    const endDate = addDays(new Date(viewYear, viewMonth + 1, 0), 7);
    let cur = new Date(startDate);
    while (cur <= endDate) {
      const ds = toDateStr(cur);
      map[ds] = filteredBookings.filter(b => bookingOccupiesNight(b, ds)).length;
      cur = addDays(cur, 1);
    }
    return map;
  }, [filteredBookings, viewYear, viewMonth]);

  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startDow = firstOfMonth.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const totalCells = Math.ceil((startDow + daysInMonth) / 7) * 7;
    return Array.from({ length: totalCells }, (_, i) => {
      const d = new Date(viewYear, viewMonth, 1 + (i - startDow));
      return { date: d, dateStr: toDateStr(d), dayNum: d.getDate(), isCurrentMonth: d.getMonth() === viewMonth };
    });
  }, [viewYear, viewMonth]);

  const selRange = useMemo(() => {
    if (!selStart && !selEnd) return { start: null, end: null };
    if (selStart && !selEnd) return { start: selStart, end: selStart };
    const a = selStart < selEnd ? selStart : selEnd;
    const b = selStart < selEnd ? selEnd : selStart;
    return { start: a, end: b };
  }, [selStart, selEnd]);

  const selectedBookings = useMemo(() => {
    if (!selRange.start) return [];
    return filteredBookings.filter(b => bookingOverlapsRange(b, selRange.start, selRange.end));
  }, [filteredBookings, selRange]);

  const handleMouseDown = useCallback((dateStr) => {
    setDragStart(dateStr); setIsDragging(true); setSelStart(dateStr); setSelEnd(null);
  }, []);
  const handleMouseEnter = useCallback((dateStr) => {
    setHoverDate(dateStr);
    if (isDragging && dragStart) setSelEnd(dateStr);
  }, [isDragging, dragStart]);
  const handleMouseUp = useCallback((dateStr) => {
    if (isDragging) { setSelEnd(dateStr || dragStart); setIsDragging(false); setDragStart(null); }
  }, [isDragging, dragStart]);
  const handleCellClick = useCallback((dateStr) => {
    if (!isDragging) { setSelStart(dateStr); setSelEnd(dateStr); }
  }, [isDragging]);

  useEffect(() => {
    const handleGlobalUp = () => { if (isDragging) { setIsDragging(false); setDragStart(null); } };
    window.addEventListener("mouseup", handleGlobalUp);
    return () => window.removeEventListener("mouseup", handleGlobalUp);
  }, [isDragging]);

  const goToPrev = () => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else setViewMonth(m => m - 1); };
  const goToNext = () => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else setViewMonth(m => m + 1); };
  const goToToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); };

  const handleExport = useCallback(() => {
    const rows = selectedBookings.length > 0 ? selectedBookings : filteredBookings;
    const header = ["ID","Guest Name","Room","Room Type","Check-in","Check-out","Nights","Guests","Amount","Currency","Status","Source"];
    const lines = rows.map(b => {
      const nights = diffDays(parseDate(b.checkIn), parseDate(b.checkOut));
      return [b.id, b.guestName, b.roomNumber, b.roomType, b.checkIn, b.checkOut, nights, b.guests, b.totalAmount, b.currency, b.status, b.source].join(",");
    });
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bookings_export.csv"; a.click();
    URL.revokeObjectURL(url);
  }, [selectedBookings, filteredBookings]);

  // ─── TIMELINE VIEW ─────────────────────────────────────────────────────────
  const TimelineView = () => {
    const rooms = ["101","102","103","201","202","203","301","302","401","402"];
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const monthStart = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-01`;
    const monthEnd = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;

    const roomBookings = useMemo(() =>
      rooms.reduce((acc, r) => {
        acc[r] = filteredBookings.filter(b => b.roomNumber === r && b.status !== "cancelled" && b.checkIn <= monthEnd && b.checkOut > monthStart);
        return acc;
      }, {}), []);

    const colW = Math.max(24, Math.floor(640 / daysInMonth));

    return (
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${120 + daysInMonth * colW}px` }}>
          <div className="flex border-b border-slate-200 mb-1">
            <div className="w-28 shrink-0 text-xs font-semibold text-slate-500 px-2 py-1">Room</div>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
              <div key={d} style={{ width: colW, minWidth: colW }}
                className={`text-center text-[10px] font-medium py-1 shrink-0
                  ${toDateStr(new Date(viewYear, viewMonth, d)) === todayStr ? "text-indigo-600 font-bold" : "text-slate-400"}`}>
                {d}
              </div>
            ))}
          </div>
          {rooms.map(room => (
            <div key={room} className="flex items-center mb-0.5">
              <div className="w-28 shrink-0 text-xs font-medium text-slate-600 px-2 py-1 bg-slate-50 rounded-l-lg">
                Rm {room}
                <span className="text-[10px] text-slate-400 ml-1">
                  {filteredBookings.find(b => b.roomNumber === room)?.roomType?.slice(0, 3) ?? ""}
                </span>
              </div>
              <div className="flex relative h-7 flex-1" style={{ width: `${daysInMonth * colW}px` }}>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                  const ds = toDateStr(new Date(viewYear, viewMonth, d));
                  const isWeekend = [0, 6].includes(new Date(viewYear, viewMonth, d).getDay());
                  return (
                    <div key={d} style={{ width: colW, minWidth: colW }}
                      className={`h-full border-r border-slate-100 shrink-0 ${ds === todayStr ? "bg-indigo-50" : isWeekend ? "bg-slate-50/50" : ""}`} />
                  );
                })}
                {roomBookings[room].map(b => {
                  const ci = parseDate(b.checkIn);
                  const co = parseDate(b.checkOut);
                  const mStart = new Date(viewYear, viewMonth, 1);
                  const mEnd = new Date(viewYear, viewMonth + 1, 0);
                  const barStart = ci < mStart ? mStart : ci;
                  const barEnd = co > addDays(mEnd, 1) ? addDays(mEnd, 1) : co;
                  const left = diffDays(mStart, barStart);
                  const width = diffDays(barStart, barEnd);
                  const barColors = { confirmed: "bg-emerald-400", checked_in: "bg-blue-400", checked_out: "bg-slate-400", cancelled: "bg-red-300" };
                  return (
                    <div key={b.id}
                      style={{ left: left * colW, width: width * colW - 1, top: "4px", height: "20px" }}
                      className={`absolute rounded-md ${barColors[b.status] || "bg-slate-400"} text-white text-[9px] font-medium flex items-center px-1.5 overflow-hidden cursor-pointer hover:brightness-110 transition-all shadow-sm z-10`}
                      title={`${b.guestName} (${b.checkIn} → ${b.checkOut})`}
                      onClick={() => { setSelStart(b.checkIn); setSelEnd(toDateStr(addDays(parseDate(b.checkOut), -1))); }}
                    >
                      <span className="truncate">{b.guestName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const selRangeLabel = selRange.start
    ? selRange.start === selRange.end
      ? new Date(selRange.start + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
      : `${new Date(selRange.start + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })} → ${new Date(selRange.end + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 font-sans">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">

        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">🏨 Guestara</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Occupancy Heatmap · {TOTAL_ROOMS} rooms</p>
            </div>
            <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 self-start sm:self-auto">
              {["calendar", "timeline"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${activeTab === tab ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
                  {tab === "calendar" ? "📅 Calendar" : "📊 Timeline"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <StatsStrip bookings={filteredBookings} year={viewYear} month={viewMonth} />

        {/* Search */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Filters */}
        <FilterBar filters={filters} onChange={setFilters} onExport={handleExport} />

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Month nav */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button onClick={goToPrev} className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 min-w-[140px] sm:min-w-[160px] text-center">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </h2>
                  <button onClick={goToNext} className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Legend />
                  <button onClick={goToToday}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-colors">
                    Today
                  </button>
                </div>
              </div>

              <div className="p-2 sm:p-4">
                {activeTab === "calendar" ? (
                  <>
                    <div className="grid grid-cols-7 mb-2">
                      {DAYS_OF_WEEK.map(d => (
                        <div key={d} className="text-center text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider py-1 sm:py-2">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 sm:gap-1.5"
                      onMouseLeave={() => { if (isDragging) setIsDragging(false); }}>
                      {calendarDays.map(({ dateStr, dayNum, isCurrentMonth }) => {
                        const occupancy = occupancyMap[dateStr] ?? 0;
                        const inRange = selRange.start && selRange.end && dateStr >= selRange.start && dateStr <= selRange.end;
                        const isSearchHighlight = searchHighlightDates.has(dateStr);
                        return (
                          <div key={dateStr} className={`relative ${isSearchHighlight ? "ring-2 ring-yellow-400 ring-offset-1 rounded-lg" : ""}`}>
                            <DayCell
                              dateStr={dateStr} dayNum={dayNum} isCurrentMonth={isCurrentMonth}
                              occupancy={occupancy} isToday={dateStr === todayStr}
                              isSelected={selRange.start === dateStr || selRange.end === dateStr}
                              isInRange={!!inRange} isDragging={isDragging}
                              onMouseDown={handleMouseDown} onMouseEnter={handleMouseEnter}
                              onMouseUp={handleMouseUp} onClick={handleCellClick}
                              bookings={filteredBookings} showTooltip={true}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <TimelineView />
                )}
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {selRange.start ? "Booking Details" : "Select a Date"}
                </h3>
                {selRangeLabel && <p className="text-xs text-indigo-600 mt-0.5 font-medium">{selRangeLabel}</p>}
                {selRange.start && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedBookings.length} booking{selectedBookings.length !== 1 ? "s" : ""} found
                  </p>
                )}
              </div>

              <div className="p-3 sm:p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)", minHeight: "200px" }}>
                {!selRange.start ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl mb-3">👆</div>
                    <p className="text-sm text-slate-500">Click or drag on the calendar to select dates</p>
                    <p className="text-xs text-slate-400 mt-2">Drag across multiple days to select a range</p>
                  </div>
                ) : selectedBookings.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl mb-3">🌙</div>
                    <p className="text-sm text-slate-500 font-medium">No bookings</p>
                    <p className="text-xs text-slate-400 mt-1">All rooms available on this date</p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {selectedBookings.map(b => <BookingCard key={b.id} booking={b} />)}
                  </div>
                )}
              </div>

              {selRange.start && (
                <div className="px-4 py-3 border-t border-slate-100">
                  <button onClick={() => { setSelStart(null); setSelEnd(null); }}
                    className="w-full text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 py-1.5 rounded-lg transition-colors">
                    Clear selection
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Guestara Front Desk · {bookings.length} total bookings · {filteredBookings.length} after filters
        </div>
      </div>
    </div>
  );
}