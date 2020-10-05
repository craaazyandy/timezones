<?php
 /**
  * Andy Cheng
  * Date: 10/03/2020
  */

 namespace App\Controller;


 use App\Entity\User;
 use App\Repository\UserRepository;
 use Doctrine\ORM\EntityManagerInterface;
 use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
 use Symfony\Component\HttpFoundation\JsonResponse;
 use Symfony\Component\HttpFoundation\Request;
 use Symfony\Component\Routing\Annotation\Route;

 /**
  * Class UserController
  * @package App\Controller
  * @Route("/", name="user_api")
  */
 class UserController extends AbstractController
 {
  /**
   * Get all users
   * 
   * @param UserRepository $userRepository
   * @return JsonResponse
   * @Route("/users", name="users", methods={"GET"})
   */
  public function getUsers(UserRepository $userRepository) {
   $data = $userRepository->findAll();
   return $this->response($data);
  }

  /**
   * @param Request $request
   * @param EntityManagerInterface $entityManager
   * @param UserRepository $userRepository
   * @return JsonResponse
   * @throws \Exception
   * @Route("/user", name="user_add", methods={"POST"})
   */
  public function addUser(Request $request, EntityManagerInterface $entityManager, UserRepository $userRepository) {

   try {
    $request = $this->transformJsonBody($request);

    if ( !$request || !$request->get('email') || !$request->request->get('password') || !$request->request->get('level') ) {
     throw new \Exception();
    }

    $user = new User();
    $user->setEmail($request->get('email'));
    $post->setDescription($request->get('description'));
    $entityManager->persist($post);
    $entityManager->flush();

    $data = [
     'status' => 200,
     'success' => "Post added successfully",
    ];
    return $this->response($data);

   }catch (\Exception $e){
    $data = [
     'status' => 422,
     'errors' => "Data no valid",
    ];
    return $this->response($data, 422);
   }

  }


  /**
   * @param PostRepository $postRepository
   * @param $id
   * @return JsonResponse
   * @Route("/posts/{id}", name="posts_get", methods={"GET"})
   */
  public function getUser(PostRepository $postRepository, $id){
   $post = $postRepository->find($id);

   if (!$post){
    $data = [
     'status' => 404,
     'errors' => "Post not found",
    ];
    return $this->response($data, 404);
   }
   return $this->response($post);
  }

  /**
   * @param Request $request
   * @param EntityManagerInterface $entityManager
   * @param PostRepository $postRepository
   * @param $id
   * @return JsonResponse
   * @Route("/posts/{id}", name="posts_put", methods={"PUT"})
   */
  public function updateUser(Request $request, EntityManagerInterface $entityManager, PostRepository $postRepository, $id){

   try{
    $post = $postRepository->find($id);

    if (!$post){
     $data = [
      'status' => 404,
      'errors' => "Post not found",
     ];
     return $this->response($data, 404);
    }

    $request = $this->transformJsonBody($request);

    if (!$request || !$request->get('name') || !$request->request->get('description')){
     throw new \Exception();
    }

    $post->setName($request->get('name'));
    $post->setDescription($request->get('description'));
    $entityManager->flush();

    $data = [
     'status' => 200,
     'errors' => "Post updated successfully",
    ];
    return $this->response($data);

   }catch (\Exception $e){
    $data = [
     'status' => 422,
     'errors' => "Data no valid",
    ];
    return $this->response($data, 422);
   }

  }


  /**
   * @param PostRepository $postRepository
   * @param $id
   * @return JsonResponse
   * @Route("/posts/{id}", name="posts_delete", methods={"DELETE"})
   */
  public function deletePost(EntityManagerInterface $entityManager, PostRepository $postRepository, $id){
   $post = $postRepository->find($id);

   if (!$post){
    $data = [
     'status' => 404,
     'errors' => "Post not found",
    ];
    return $this->response($data, 404);
   }

   $entityManager->remove($post);
   $entityManager->flush();
   $data = [
    'status' => 200,
    'errors' => "Post deleted successfully",
   ];
   return $this->response($data);
  }





  /**
   * Returns a JSON response
   *
   * @param array $data
   * @param $status
   * @param array $headers
   * @return JsonResponse
   */
  public function response($data, $status = 200, $headers = [])
  {
   return new JsonResponse($data, $status, $headers);
  }

  protected function transformJsonBody(\Symfony\Component\HttpFoundation\Request $request)
  {
   $data = json_decode($request->getContent(), true);

   if ($data === null) {
    return $request;
   }

   $request->request->replace($data);

   return $request;
  }

 }