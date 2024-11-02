import Sort from "./form/Sort";
import SearchTerm from "./form/SearchTerm";

const DataPageBanner = (
    { 
        sort=true, 
        search=true,
        admin=false,

        searchError, 
        setSearchError, 
        setSearchTerm, 
        sortValidationFunction, 
        placeholder,

        sortError, 
        setSortError, 
        sortValue, 
        setSortValue, 
        options, 
        searchValidationFunction
    }) => {

    const bannerStyle = { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        gap: '16px', 
        padding: '16px', 
        paddingTop: '40px', 
        backgroundColor: admin ? '#f5f5f5' : '#fff',
        borderRadius: 5, 
        marginBottom: '16px' 
    };

  return (
    (sort || search) &&  
    <div style={bannerStyle}>
        {search && (
            <SearchTerm
            searchError={searchError}
            setSearchError={setSearchError}
            setSearchTerm={setSearchTerm}
            validationFunction={searchValidationFunction}
            placeholder={placeholder}
            />
        )}

        {sort && (
            <Sort
            sortError={sortError}
            setSortError={setSortError}
            sortValue={sortValue}
            setSortValue={setSortValue}
            options={options}
            validationFunction={sortValidationFunction}
            />
        )}
    </div>
  )
};

export default DataPageBanner;