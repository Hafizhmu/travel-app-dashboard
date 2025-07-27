import { Header } from "components";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import type { Route } from "./+types/create-trip";

export const loader = async () => {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags,latlng,maps"
  );
  const data = await response.json();

  return data.map((country: any) => ({
    name: country.name.common,
    flag: country.flags?.png ?? "", // ambil gambar bendera
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMap,
  }));
};

const createTrip = ({ loaderData }: Route.ComponentProps) => {
  const handleSubmit = async () => {};
  const handleChange = async () => {};

  const countries = loaderData as Country[];

  // ⬇️ Data yang dikirim ke ComboBox
  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value,
    flag: country.flag,
  }));

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Add a New Trip"
        description="View and edit AI Generated travel plans"
      />

      <section className="mt-2.5 wrapper-md">
        <form action="" className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ value: "value", text: "text" }}
              placeholder="Select a country"
              className="combo-box"
              change={(e :{ value:string |undefined}) =>
            {
                if (e.value) {
                    handleChange('country', e.value);
                }
            }}
              itemTemplate={(data: any) => (
                <div className="flex items-center gap-2">
                  <img
                    src={data.flag}
                    alt={`Flag of ${data.text}`}
                    className="w-5 h-4 object-cover rounded-sm"
                  />
                  <span>{data.text}</span>
                </div>
              )}
            />
          </div>
        </form>
      </section>
    </main>
  );
};

export default createTrip;
