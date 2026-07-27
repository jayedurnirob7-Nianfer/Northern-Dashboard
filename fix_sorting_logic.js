const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

const oldSortLogic = `  const filteredShipments = shipments.filter((s: any) => statusFilter === 'All' || s.status === statusFilter).sort((a: any, b: any) => {
    const aDelivered = a.status === 'Delivered' ? 1 : 0;
    const bDelivered = b.status === 'Delivered' ? 1 : 0;
    if (aDelivered !== bDelivered) return aDelivered - bDelivered;
    
    // Whether delivered or pending, the user requested descending order for NORS numbers if dates are not used
    if (aDelivered === 1 && bDelivered === 1) {
      // Both delivered: Sort by Delivery Date descending (newest first)
      const dateA = a.deliveryDate ? new Date(a.deliveryDate).getTime() : 0;
      const dateB = b.deliveryDate ? new Date(b.deliveryDate).getTime() : 0;
      if (dateA !== dateB && !isNaN(dateA) && !isNaN(dateB)) {
        return dateB - dateA; // Descending
      }
    }
    
    // Fallback or Pending: sort by NORS number descending (user request: "the pending and all the data from shipping no coulmn needs to be sorted out Descending not Aesending.")
    const aNum = parseInt((a.shippingNumber || '').replace(/\\D/g, ''), 10) || 0;
    const bNum = parseInt((b.shippingNumber || '').replace(/\\D/g, ''), 10) || 0;
    return bNum - aNum;
  });`;

const newSortLogic = `  const filteredShipments = shipments.filter((s: any) => statusFilter === 'All' || s.status === statusFilter).sort((a: any, b: any) => {
    // Pure descending sort by NORS number, regardless of status.
    const aNum = parseInt((a.shippingNumber || '').replace(/\\D/g, ''), 10) || 0;
    const bNum = parseInt((b.shippingNumber || '').replace(/\\D/g, ''), 10) || 0;
    return bNum - aNum;
  });`;

code = code.replace(oldSortLogic, newSortLogic);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed sort logic to be strictly descending by NORS number');
