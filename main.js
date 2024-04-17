const projects = require('./projects.json');

const newProjects = projects.map((proj, i) => {

  const tables = proj.prices_table ? proj.prices_table.map(table => ({
    "rooms": table.rooms, // which one is 1 which is more
    "bedrooms": table.rooms, // which one is 1 which is more
    "bathrooms": table.bathrooms,
    "size": table.m2,
    "price": table.price
  })) : null;
  const facilities = proj.facilties.map(facility => ({
    "id": facility.facilties_id
  }))

  const project = {
    "name": {
      "en": proj.translations.find(t => t.languages_code === 'en')?.name || "",
      "ar": proj.translations.find(t => t.languages_code === 'ar').name
    },
    "desc": {
      "en": proj.translations.find(t => t.languages_code === 'en')?.short_description || "",
      "ar": proj.translations.find(t => t.languages_code === 'ar').short_description
    },
    "content": {
      "en": proj.translations.find(t => t => t.languages_code === 'en')?.details || "",
      "ar": proj.translations.find(t => t => t.languages_code === 'ar').details
    },
    "construction_company": proj.translations.find(t => t => t.languages_code === 'ar').construction_company,
    "building_date": "", // no building_date
    "delivery_date": proj.delivery_date,
    "block_count": proj.block_count,
    "units_count": proj.total_number_of_units,
    "commercial_count": proj.total_number_of_commercial_units,
    "floor_count": proj.floor_count,
    "land_size": proj.total_development_land_size,
    "construction_size": proj.constructed_area,
    "facility_size": proj.landscape_facilities_total_area,
    "video": null,
    "status": proj.project_status.id,
    "type": proj.type,
    "price": proj.price_start_from,
    "views_count": "", // no view counts
    "date": "", // what date?
    "seo_title": {
      "en": proj.translations.find(t => t.languages_code === 'en')?.title || "",
      "ar": proj.translations.find(t => t.languages_code === 'ar').title
    },
    "meta_desc": {
      "en": proj.translations.find(t => t.languages_code === 'en')?.meta_description || "",
      "ar": proj.translations.find(t => t.languages_code === 'ar').meta_description
    },
    "meta_keywords": proj.translations.find(t => t.languages_code === 'ar')?.meta_keywords.join(', ') || "", // ar and en ??
    "slug": proj.slug || "", // short or long slug?
    "country_id": "1",
    "city_id": proj.city.id,
    "district_id": proj.district.id,
    "neighborhood_id": proj.neighborhood.id,
    "peyment_id": proj.payment_methods, // what is this?
    "user_id": "1",
    "deleted_at": null,
    "pic": "example-image1.jpg",
    "images": [
      {
        "image_path": "example-image1.jpg"
      },
      {
        "image_path": "example-image2.jpg"
      }
    ],
    "types": proj.types,
    "rooms": proj.rooms,
    "features": proj.features,
    "statuses": [
      {
        "id": proj.project_status.id
      }
    ],
    "facilities": facilities,
    "tables": tables,
    "payment_installment_plans": [
      {
        "percentage": "",
        "number": ""
      }
    ], // no payment plan
    "latitude": proj.location.coordinates[0],
    "longitude": proj.location.coordinates[1],
    "status": "0",
  }

  for (const key in project) {
    if (project[key] === null) {
      project[key] = ""
    }
  }

  return project;
})


// console.log(newProjects);


async function postData() {
  const batchSize = 10;
  for (let i = 0; i < newProjects.length; i += batchSize) {
    const batch = newProjects.slice(i, i + batchSize);
    const promises = [];

    for (const project of batch) {
      const promise = fetch('https://backend.skylineholding.sa/api/storeApi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project)
      })
        .then(response => {
          console.log(`Status Code: ${response.status}`);
          return response.json();
        })
        .then(data => console.log(`Project ${project.name.en} done`))
        .catch(error => console.error(`Error at Project ${project.name.en}:`, error));

      promises.push(promise);
    }

    await Promise.all(promises)
      .then(() => console.log(`\n****************** Batch ${i / batchSize + 1} done ******************\n`))
      .catch(error => console.error(`Error at Batch ${i / batchSize + 1}:`, error));

  }
}


console.log(JSON.stringify(newProjects[0]))
fetch('https://backend.skylineholding.sa/api/storeApi', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newProjects[0])
})
  .then(response => {
    console.log(`Status Code: ${response.status}`);
    return response.json();
  })
  .then(data => console.log('Data:', data))
  .catch(error => console.error('Error:', error));
