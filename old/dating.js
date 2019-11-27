function makeDateString(d) {
  month = (d.getMonth() + 1).toString();
  if (month.length == 1) {
    month = "0" + month;
  }
  d = [d.getFullYear(), month, d.getDate()];
  d = d
    .map(function(item) {
      return item.toString();
    })
    .join("");
  return d;
}

let today = new Date();
today = makeDateString(today);
let twoMonthsAgo = new Date();
twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);
twoMonthsAgo = makeDateString(twoMonthsAgo);

let reqUrl = `http://brm-core-0.brsrvr.com/api/v1/core/?account_id=5221&auth_key=o5xlkgn7my5fmr5c&domain_key=livingspaces_com&ptype=category&request_type=search&search_type=keyword&request_id=5bf4c900-a069-414a-abc0-cf5d78ea6868&url=https%3a%2f%2fwww.livingspaces.com%2fdepartments%2ffeatured%2fnew-arrivals&_br_uid_2=uid%3D4490539570488%3Av%3D12.0%3Ats%3D1561674361031%3Ahc%3D1377&q=&start=0&rows=4&fl=pid%2cskuid%2cbrand%2cdescription%2claunch_date%2cclearance%2ccrumbs%2cprice%2cthumb_image%2curl%2ctitle%2cinStockQuantity%2csku_thum_images&fq=launch_date_order:%5b${twoMonthsAgo}+TO+${today}%5d`;
