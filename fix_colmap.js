const fs = require('fs');

let html = fs.readFileSync('public/invoice/index.html', 'utf8');

const targetStr = `            // Setting up colMap to be explicit, as detectColMap relies on hdrs
            colMap = {
              "Name": "Name",
              "Address": "Address",
              "Mobile": "Mobile",
              "Date": "Date",
              "Weight": "Weight",
              "Rate": "Rate",
              "Total": "Total",
              "Tracking": "Tracking Number",
              "Shipping": "Shipping Number",
              "Mark": "Shipping Mark",
              "Product": "Product Name",
              "Quantity": "Quantity"
            };`;

const newStr = `            // Setting up colMap to be explicit, as detectColMap relies on hdrs
            colMap = {
              "Name": "Name",
              "Address": "Address",
              "Mobile": "Mobile",
              "Date": "Date",
              "Weight": "Weight",
              "Cost": "Rate",
              "Total": "Total",
              "TrackingNumber": "Tracking Number",
              "ShippingNumber": "Shipping Number",
              "ShippingMark": "Shipping Mark",
              "Description": "Product Name",
              "Unit": "Quantity"
            };`;

html = html.replace(targetStr, newStr);

fs.writeFileSync('public/invoice/index.html', html);
console.log('Fixed colMap keys');
