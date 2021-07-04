import axios from 'axios';

export const utils = {
  fetchWgerData: function (dataToFetch, setStateFn, error, setError) {
    axios
      .get(`https://wger.de/api/v2/${dataToFetch}`, { timeout: 20000 })
      .then((res) => setStateFn(res.data.results))
      .catch(() => setError({ ...error, isError: true }));
  },
};
