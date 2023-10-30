const createRequest = async (url, method, data = {}, headers = {}) => {
  try {
    let response;
    let actualMethod; 
      
    if (method === 'allTickets' || 
    method.startsWith('delete') || 
    method.startsWith('ticket')) {
      actualMethod = method;
    }
       

    switch (method) {
      case 'createTicket':
        response = await fetch(`${url}?method=${method}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        });
        break;

      case 'updateById':
        response = await fetch(`${url}?method=${method}&id=${data.id}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        });
        break;

      case 'allTickets':
      case 'ticketById':
      case 'deleteById': {
        const queryString = new URLSearchParams(
          actualMethod ? data : {},
        ).toString();
        response = await fetch(
          `${url}?method=${method}${queryString ? `&${queryString}` : ''}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
          },
        );
        break;
      }

      default:
        console.error('Метод не существует');
        return null;
    }

    if (response.ok) {
      return method === 'deleteById' ? 'success' : await response.json();
    }

    console.error(`Ошибка сервера: ${response.statusText}`);
    return null;
  } catch (error) {
    console.error('Ошибка сети:', error);
    return null;
  }
};

export default createRequest;