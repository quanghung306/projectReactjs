import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createAxios } from '../../../createInstance';
import { deleteCarts } from '../../../redux/apiRequest';
import { loginSuccess } from '../../../redux/authSlice';
import Footer from '../../Footer/Footer';
import NavBar from '../../NavBar/NavBar';
import './Cart.scss';
import cart from '../../../../src/assets/imgs/cart.png';

let listCarts = [];
function Cart() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const carts = useSelector((state) => state.auth.login?.allCarts);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const axiosJWT = createAxios(user, dispatch, loginSuccess());

    const [count, setCount] = useState();

    useEffect(() => {
        if (!user) {
            navigate('/dang-nhap');
        }
    });

    //lấy danh sách giỏ hàng của user
    listCarts = [];
    for (let i = 0; i < carts?.length; i++) {
        if (carts[i].userId === user?._id) {
            listCarts.push(carts[i]);
        }
    }

    const handleNumber = (value) => {
        let newcount;
        if (value === '+') {
            if (count < 99) {
                newcount = count + 1;
                setCount(newcount);
            }
        } else {
            if (count > 1) {
                newcount = count - 1;
                setCount(newcount);
            }
        }
    };

    //xóa sản phẩm khỏi giỏ hàng
    const handleDeleteProduct = (id) => {
        deleteCarts(dispatch, id, axiosJWT);
    };

    return (
        <div className="cart-container">
            <NavBar />
            <div className="wrapper">
                <table>
                    <tbody>
                        <tr className="header">
                            <th>Ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Tổng tiền</th>
                        </tr>
                        {!listCarts || listCarts?.length === 0 ? (
                            <tr className="cart-empty">
                                <td>
                                    <img src={cart} alt="giỏ hàng trống" />
                                    <p>Chưa có sản phẩm nào được thêm vào giỏ hàng</p>
                                </td>
                            </tr>
                        ) : (
                            listCarts.map((item) => {
                                return item.userId === user?._id ? (
                                    <tr className="body" key={item._id}>
                                        <td>
                                            <img src={item.avatar} alt="" />
                                        </td>
                                        <td>
                                            <p>{item.description}</p>
                                        </td>
                                        <td>
                                            <span>
                                                {Intl.NumberFormat('de-DE', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(item.price)}
                                            </span>
                                        </td>
                                        <td className="quantity">
                                            <div className="minus" onClick={() => handleNumber('-')}>
                                                -
                                            </div>
                                            <input
                                                type="number"
                                                value={item.count}
                                                onChange={(e) => setCount(e.target.value)}
                                                readOnly={false} //không cho nhập
                                            />
                                            <div className="plus" onClick={() => handleNumber('+')}>
                                                +
                                            </div>
                                        </td>
                                        <td>
                                            <span>
                                                {Intl.NumberFormat('de-DE', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(item.productTotal)}
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={(e) => handleDeleteProduct(item._id)}>Xóa</button>
                                        </td>
                                    </tr>
                                ) : (
                                    ''
                                );
                            })
                        )}
                    </tbody>
                </table>
                <div className="wrapper-btn">
                    <Link to="/gio-hang/thanh-toan">Thanh toán</Link>
                </div>
                <div className="wrapper-description">Giao hàng sớm nhất từ 3 đến 5 ngày</div>
            </div>
            <Footer />
        </div>
    );
}

export default Cart;
